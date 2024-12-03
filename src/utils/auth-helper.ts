import jwt from 'jsonwebtoken';

export const generateToken = (payload: any): string => {
    const jwtSecret: jwt.Secret = process.env.JWT_SECRET || '';
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1d' });
    return token;
}