import jwt from 'jsonwebtoken';
import { User } from '../types/interfaces';

export const generateToken = (payload: object): string => {
    const jwtSecret: jwt.Secret = process.env.JWT_SECRET || '';
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1d' });
    return token;
}