import { NextFunction, Request, RequestHandler, Response } from "express";
import { request } from "http";

const catchAsync = (fn: RequestHandler) => async (req: Request, res: Response, next: NextFunction):Promise<void> => {
    try {
        await fn(req, res, next)
    } catch (error) {
        console.error(error, request); // Log the error
        next(error)
    }
}
export default catchAsync;