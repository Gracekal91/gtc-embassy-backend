import mongoose from 'mongoose';
import UserModel from '../models/user';



/*
* @private admin only
* POST
* @params none
* update user, return the updated user
* */

export const createUser = (values: Record<string, any>) => new UserModel(values).save().then((user) =>user.toObject());

/*
* @private admin only
* GET
* @params none
* returns all the users
* */

export const getAllUsers = async () => await UserModel.find();


/*
* @private admin only
* GET
* @params id
* return a single user
* */

export const getUserById = async (id: string) => await UserModel.findById(id);

/*
* @private admin only
* GET
* @params role
* return users with a specific role
* */
export const getUserByRole = (role: string) => UserModel.findOne({role});

/*
* @private admin only
* PGET
* @params email
* update user, return the updated user
* */

export const getUSerByEmail = (email: string) => UserModel.findOne({email});

/*
* @private admin only
* GET
* @params session
* return a user
* */
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({
    'authentication.sessionToken': sessionToken,
});

/*
* @private admin only
* DELETE
* @params id
* update user, return the updated user
* */

export const deleteUserById = (id: string) => UserModel.findOneAndDelete({_id: id});

/*
* @private admin only
* UPDATE
* @params id
* update user, return the updated user
* */
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values);