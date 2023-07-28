// src/middleware/auth.middleware.ts
import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';
const secretKey = process.env.JWT_SECRET || 'default-secret';

const generateAccessToken = (userId: string) => {
    const secretKey = process.env.JWT_SECRET || 'default-secret';
    return jwt.sign({ userId }, secretKey, { expiresIn: '15m' });
};

const isAuthenticated = async (req: express.Request, res: express.Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        // implement code to check for refresh token saved in the data under user
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
        // @ts-ignore
        if (error.name === 'TokenExpiredError') {
            // Access token has expired, check for refresh token
            const refreshToken = req.header('Refresh-Token');

            if (!refreshToken) {
                return res.status(401).json({ error: 'Invalid token or token is expired. Refresh token not provided.' });
            }

            try {
                const decodedRefresh = jwt.verify(refreshToken, secretKey) as { userId: string };
                const user = await User.findById(decodedRefresh.userId);

                if (!user) {
                    return res.status(401).json({ error: 'User not found' });
                }

                // Generate a new access token
                const newAccessToken = generateAccessToken(user._id);

                // Update the user's refresh token in the database if necessary
                // ...

                // Send the new access token to the client
                res.setHeader('New-Access-Token', newAccessToken);
                console.log('----------------------> ---------------------- New access token', newAccessToken);

                // Continue with the request
                req.user = user;
                next();
            } catch (error) {
                return res.status(401).json({ error: 'Invalid refresh token or token is expired.' });
            }
        } else {
            console.log(error);
            return res.status(401).json({ error: 'Invalid token or token is expired' });
        }
    }
};

export default isAuthenticated;
