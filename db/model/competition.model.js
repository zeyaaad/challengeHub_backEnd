import mongoose from "mongoose";
import { scoreModel } from "./score.model.js";
import { subscriberModel } from "./subscriber.model.js";
const competitionSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'name required'],
        minLength: [2, 'too short  name']
    },
    type: {
        type: Number,
        enum: [0, 1], // 0 => offline, 1 => online
        required: [true, "competition type is required"]
    },
    desc: {
        type: String,
        required: [true, "competition description required"]
    },
    NumberOfEq: Number,
    expire: {
        type: Date,
        default: null
    },
    eqDegree: {
        type: Number,
        default: 5
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });




export const competitionModel = mongoose.model('competition', competitionSchema);
