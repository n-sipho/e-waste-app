import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/api-error';

export class AuthMiddleware {
    static verifyToken = (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization;
        if (!token) {
            throw new ApiError('Access denied', 401);
        }
        try {
            const jwtSecret: jwt.Secret = process.env.JWT_SECRET || '';
            console.log('jwtSecret', jwtSecret);

            const user = jwt.verify(token, jwtSecret);
            req.user = user;
            next();
        } catch (error) {
            throw new ApiError('Invalid token', 401);
        }
    }
}  