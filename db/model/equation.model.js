import mongoose from "mongoose";

const equationSchema = mongoose.Schema({
    eq:{ 
        type:String,
        required: [true, "eq name   required"],
    },
    com_id:{
        type: mongoose.Types.ObjectId,
        ref: "competition",
        required: [true, "competition id required"],
    },
    true_answer:{
        type:String,
        required: [true, "true answer  required"],

    },
    answers:[String]

}, { timestamps: true });

    

export const equationModel = mongoose.model('equation', equationSchema);



// req -> [com_id:com_id , eqs:[ {rq,true_answer,answers} ] ]