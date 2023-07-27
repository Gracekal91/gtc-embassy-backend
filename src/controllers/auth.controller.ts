import mongoose from 'mongoose';
import express from 'express';
import {createUser, getUSerByEmail} from "../actions/userActions";
import {authentication, random} from "../helpers";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/*
* POST
* returned new user
* */

export const login = async (req: express.Request, res: express.Response) =>{
    const {email, password} = req.body;
    try{
        if(!email || !password) return res.json('please provide password email');
        console.log('status -----------', email, password );

        const user = await getUSerByEmail(email);
        console.log('status -----------', user);

        if(!user) return res.status(403).json(`The user with ${email} does not exist`);
       // @ts-ignore
        const isValidPassword = await bcrypt.compare(password, user.password);

       if(!isValidPassword) return res.status(403).json('invalid password');

       //log the user in
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // @ts-ignore
        user.refreshToken = generateRefreshToken(refreshToken);
        await user.save();

        res.cookie('GTE_AUTH', accessToken, {
            httpOnly: true, // Cookie cannot be accessed via JavaScript
            //secure: process.env.NODE_ENV === 'production', // Set to true in production
            sameSite: 'strict', // Enforce same-site cookies
        });

        return res.json({accessToken, refreshToken});

    }catch (e) {
        console.log('Error', e);
        res.status(400).json(e);
    }
}

// This will go in the helper

const generateAccessToken = (userId: string) => {
    const secretKey = process.env.JWT_SECRET || 'default-secret';
    return jwt.sign({ userId }, secretKey, { expiresIn: '15m' });
};

const generateRefreshToken = (userId: string) => {
    const secretKey = process.env.JWT_SECRET || 'default-secret';
    return jwt.sign({ userId }, secretKey, { expiresIn: '7d' });
};

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