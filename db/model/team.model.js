import mongoose from "mongoose";

const teamSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'team name required'],
        minLength: [2, 'too short team name']
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
    },
    type: {
        type: Number,
        enum: [0, 1], // 0=> indivaidal , 1=> team
        required:[true,"Team type are required"]
    },
    members: [String] ,
    teamCount:{
        type:Number,
        default:1
    }
    
}, { timestamps: true });

    

export const teamModel = mongoose.model('team', teamSchema);
