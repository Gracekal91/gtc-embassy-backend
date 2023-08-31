import mongoose from 'mongoose';
import express from 'express';
import {createUser, getUSerByEmail} from "../actions/userActions";
import {generateAccessToken, generateRefreshToken} from "../helpers";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user'

/*
* POST
* returned new user
* */

export const login = async (req: express.Request, res: express.Response) =>{
    const {email, password} = req.body;
    try{
        if(!email || !password) return res.json('please provide password and email');

        const user = await getUSerByEmail(email);

        if(!user) return res.status(403).json(`The user with ${email} does not exist`);
       // @ts-ignore
        const isValidPassword = await bcrypt.compare(password, user.password);

       if(!isValidPassword) return res.status(403).json('invalid password');

       //log the user in
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // @ts-ignore
        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('GTE_AUTH', accessToken, {
            httpOnly: false, // Cookie cannot be accessed via JavaScript
            //secure: process.env.NODE_ENV === 'production', // Set to true in production
            sameSite: 'none', // Enforce same-site cookies
            secure: true
            //domain: 'http://localhost:3500/'
        });
        res.cookie('GTE_ACCESS', accessToken, {
            httpOnly: false,
            secure: false,
            sameSite: 'none'
        })
        //@ts-ignore
        req.session.refresh_token = refreshToken

        return res.status(200).json({accessToken, refreshToken, user_id: user._id});

    }catch (e) {
        console.log('Error', e);
        res.status(400).json(e);
    }
}


/*
* POST
* returned new user
* */

export const createNewUser = async (req: express.Request, res: express.Response) =>{
    const {name, surname, email, password} = req.body;
    try{
        if(!name || !surname || !email) return res.json('All fields are required');

        const existingUser = await getUSerByEmail(email);
        if(existingUser) return res.status(409).json('user already exist');

        //create authentications

        // Create hashed password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await createUser({
            name,
            surname,
            email,
            password: hashedPassword
        })

        res.status(201).json('new user was created')

    }catch (e) {
        console.log('Error', e);
        res.sendStatus(400);
    }
}

export const getRefreshToken = async (req: express.Request, res: express.Response) => {
    try{
        const { refreshToken } = req.body;
        const cookies = req.cookies;

        const refreshSecret: string | undefined = process.env.JWT_REFRESH_SECRET;
        const accessSecret: string | undefined = process.env.JWT_SECRET;

        if(!refreshToken) return res.status(401).json('No refresh token');

        const user = await UserModel.findOne({refreshToken}).exec();
        if(!user) return  res.sendStatus(403);

        jwt.verify(
            refreshToken,
            // @ts-ignore
            refreshSecret,
            async (err, decoded) =>{
                // @ts-ignore
                if(err || user?._id != decoded?.userId) return res.sendStatus(403);
                // @ts-ignore
                const isExpired = jwt.decode(refreshToken)?.exp! < Date.now() / 1000;

                if(isExpired) return res.status(401).json('Refresh token has expired'); // force them to login
                //
                //can decode roles here
                const accessToken = jwt.sign(
                    // @ts-ignore
                    {'user_id':decoded?._id },
                    // @ts-ignore
                    accessSecret,
                    {expiresIn: '60s'}
                );
                res.json({accessToken})
            }
        )
    }catch(e){
        console.log('Error', e);
        res.status(400);
    }

}

export const logout = async (req: express.Request, res: express.Response) => {

    try {
        // @ts-ignore
        const {id} = req.body;
        const user = await UserModel.findById( id ).exec();

        if (!user) return res.sendStatus(403);

        // @ts-ignore
        user.refreshToken = null; // Clear the refresh token
        await user.save();
        res.status(200).json('Successful logged out')// Clear the refresh token cookie
    } catch (e) {
        console.log('Error', e);
        res.status(400);
    }
}

