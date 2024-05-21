import { NextFunction, Request, Response } from "express";
import ApiError from "../../errors/apiError";
import config from "../../config/index";
import jwt from "jsonwebtoken";
import jwksClient from 'jwks-rsa';
import { JwtPayload } from 'jsonwebtoken';

console.log(config.jwksUri);
const client = jwksClient({
    jwksUri: config.jwksUri || '' 
});
const auth = (...rules: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          return res.status(401).send('Authorization header is missing');
        }
      
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
          return res.status(401).send('Invalid authorization header format. Format is "Bearer token"');
        }
      
        const token = parts[1];
        jwt.verify(token, getKey, {}, function (err, decoded) {
            if (err) {
                res.status(401).send('Unauthorized');
            } else {
                req.user = decoded as JwtPayload;
                if (!req.user['cognito:groups'] || (rules.length && !rules.includes(req.user['cognito:groups'][0]))) {
                    throw new ApiError(403, "You are not authorized as the role doesn't exist!");
                }
                console.log("inside auth"+config.jwksIss);
                console.log("inside auth"+ req.user.iss);
                let iss = req.user.iss || '';
                let client_id = config.cognitoClientId || '';

                if (req.user.iss != iss) {

                    throw new ApiError(403, "Invalid token issuer");
                }
                if (req.user.client_id != client_id) {
                    throw new ApiError(403, "Invalid client id");
                }
                next();
            }
        });
    } catch (error) {
        next(error)
    }

    function getKey(header: any, callback: any) {
        client.getSigningKey(header.kid, function (err, key) {
            var signingKey = key?.getPublicKey();
            callback(null, signingKey);
        });
    }
}

export default auth;

