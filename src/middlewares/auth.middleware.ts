// src/middleware/auth.middleware.ts
import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const isAuthenticated = async (req: express.Request, res: express.Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Access token not provided' });
    }

    try {
        const secretKey = process.env.JWT_SECRET || 'default-secret';
        const decoded = jwt.verify(token, secretKey) as { userId: string };

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

export default isAuthenticated;
