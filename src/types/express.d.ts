import jwt from 'jsonwebtoken';

import { User } from "./interfaces";
export declare global {
    namespace Express {
        interface Request {
            user: jwt.JwtPayload | string;
        }
    }
}