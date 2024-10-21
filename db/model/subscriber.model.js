import mongoose from "mongoose";

const subscriberSchema = mongoose.Schema({
    com_id:{
        type: mongoose.Types.ObjectId,
        ref: "competition",
        required: [true, "competition id required"],
    },
    team_id:{
        type: mongoose.Types.ObjectId,
        ref: "team",
        required: [true, "team id required"],
    }
}, { timestamps: true });

    

export const subscriberModel = mongoose.model('subscriber', subscriberSchema);
