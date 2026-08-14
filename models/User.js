import  { Schema, model, models } from 'mongoose';

const  UserSchema = new Schema({
    name:{
        type: String,
        required: [true, 'Name is required'],
        trim:true
    },
    username:{
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    passwordHash:{
        type: String,
        required: [true, 'Password is required'],
    },
    email:{
        type: String,
        required:true,
        unique:true,
        lowercase:true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

export const User = models.User || model('User', UserSchema);