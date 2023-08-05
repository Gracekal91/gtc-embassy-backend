// src/middleware/auth.middleware.ts
import express, { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { CookieJar } from 'tough-cookie';
import User from '../models/user';

const secretKey = process.env.JWT_SECRET || 'default-secret';

const generateAccessToken = (userId: string) => {
    const secretKey = process.env.JWT_SECRET || 'default-secret';
    return jwt.sign({ userId }, secretKey, { expiresIn: '60s' });
};

const isAuthenticated = async (req: express.Request, res: express.Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const secretToken = process.env.JWT_SECRET;
    // @ts-ignore
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    // @ts-ignore
    const token = authHeader.split(' ')[1];
    // @ts-ignore
    jwt.verify(token, secretToken, async (err, decoded) => {
        if (err) {
            // Token verification failed, check if it's expired
            if (err.name === 'TokenExpiredError') {
                // @ts-ignore
                const refreshToken = req.session.refresh_token;

                if (!refreshToken) {
                    //force them to login again
                    return res.status(401).json({ error: 'Access token has expired, and refresh token is not provided.' });
                }

                try {
                    const refreshResponse = await axios.post(
                        'http://localhost:3500/auth/refresh',
                        JSON.stringify({ refreshToken }), // Pass the refresh token in the request body
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }
                    );

                    const newAccessToken = refreshResponse.data.accessToken;
                    console.log('>>>>>>>>>>>>>>>>>>>>>>>>> Iam getting a new refresh token', newAccessToken)

                    // Send the new access token to the client
                    res.setHeader('Authorization', `Bearer ${newAccessToken}`);
                    console.log('New access token:', newAccessToken);

                    // Continue with the request
                    next();
                } catch (error) {
                    console.log(error);
                    return res.status(401).json({ error: 'Invalid refresh token or token is expired.' });
                }
            } else {
                // Token is invalid for reasons other than expiration
                return res.sendStatus(403);
            }
        } else {
            // Token is valid, continue with the request
            req.headers.authorization = `Bearer ${token}`; // Make sure to set the original token in the request header
            // @ts-ignore
            req.user = decoded?.user_name;
            next();
        }
    });
};

export default isAuthenticated;