import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, ' name required'],
        minLength: [2, 'too short  name']
    },
    email:{
        type: String,
        trim: true,
        required: [true, 'email required'],
        minLength: 1,
        unique: [true, 'email must be unique']
    },
    password: {
        type: String,
        required: true,
        minLength: [6, 'minLength 6 characters'],
    }
    
}, { timestamps: true });

    

export const adminModel = mongoose.model('admin', adminSchema);
