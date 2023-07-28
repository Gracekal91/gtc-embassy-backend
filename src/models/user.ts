import mongoose, {Schema, Document} from 'mongoose';

export interface IUser extends Document {
    name: string,
    surname: string,
    email: string;
    password: string;
    refreshToken: string;
}

const userSchema: Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role:{
        type: String,
        enum : ['admin', 'employee', 'manager'],
        required: true,
        default: 'employee'
    },
    password: {type: String, required: true},
    refreshToken: { type: String }
})

export default mongoose.model<IUser>('User', userSchema);