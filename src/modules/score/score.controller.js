import { competitionModel } from "../../../db/model/competition.model.js";
import { scoreModel } from "../../../db/model/score.model.js";
import { catchAsyncError } from "../../utils/middleware/catchAsyncError.js";
import AppError from "../../utils/services/AppError.js";






export const getAll=catchAsyncError(async(req,res,next)=>{
    let {id}=req.params;
    let isExist=await competitionModel.findById(id);
    if(!isExist) return next(new AppError("competation not found ",404));
    let data=await scoreModel.findOne({com_id:id,team_id:req.user._id}).populate("team_id","name email members type ").populate("com_id");

    res.json({message:"success",data})

})


export const getHighScores=catchAsyncError(async(req,res,next)=>{
      let {id}=req.params;
    let isExist=await competitionModel.findById(id);
    if(!isExist) return next(new AppError("competation not found ",404));
    const data = await scoreModel.find({com_id:id}).sort({ final_result: -1 }).populate("team_id","name members type ").limit(3);
    res.json({message:"success",data});

})



