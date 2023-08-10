//This helper create a random token or encrypt the password
import crypto from 'crypto';
import jwt from "jsonwebtoken";

const SECRET = 'GTECH-EMBASSY-REST-API';

export const random = () => crypto.randomBytes(128).toString('base64');
export const authentication = (salt: string, password: string) => {
    return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
};

export const generateAccessToken = (userId: string) => {
    const secretKey = process.env.JWT_SECRET || 'default-secret';
    return jwt.sign({ userId }, secretKey, { expiresIn: '30s' });
};

export const generateRefreshToken = (userId: string) => {
    const secretKey = process.env.JWT_REFRESH_SECRET || 'default-secret';
    return jwt.sign({ userId }, secretKey, { expiresIn: '120s' });
};