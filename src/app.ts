import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import CookieParser from 'cookie-parser';
import httpStatus from 'http-status';
import ApiError from './errors/apiError';
import router from './app/routes/index';
import config from './config';

import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
/**const client = jwksClient({
    jwksUri: 'https://cognito-idp.{region}.amazonaws.com/{userPoolId}/.well-known/jwks.json'
  });*/
const app: Application = express();


const crypto = require('crypto');

const clientId = '5vb6fkohn7fnpi6jc6u6p608no';
const clientSecret = 'h5a5skm77ct3cb0be0de2ca4j837eaaktc1s5t8u0ejoenlvr1a';
const phoneNumber = '+17783887203';

const secretHash = crypto.createHmac('SHA256', clientSecret)
  .update(phoneNumber + clientId)
  .digest('base64');

console.log(secretHash);
app.use(cors());
app.use(CookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/favicon.ico', (req: Request, res: Response) => {
    res.status(204).end();
})

app.get('/', (req: Request, res: Response) => {
    res.send("Hello")
})

app.use('/api/v1', router);
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({ success: false, message: err.message })
    } else {
        res.status(httpStatus.NOT_FOUND).json({
            success: false,
            message: 'Something Went Wrong',
        });
    }
    next();
})

export default app;