import mongoose from "mongoose";

const scoreSchema = mongoose.Schema({
    com_id:{
        type: mongoose.Types.ObjectId,
        ref: "competition",
        required: [true, "competition id required"],
    },
    team_id:{
        type: mongoose.Types.ObjectId,
        ref: "team",
        required: [true, "team id required"],
    },
    final_result:{
        type:Number,
        required:[true,"competition final result required"]
    },
    true_eqs:[{}],
    false_eqs:[{}],
    
}, { timestamps: true });

    

export const scoreModel = mongoose.model('score', scoreSchema);
