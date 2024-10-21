import { adminModel } from "../../../db/model/admin.model.js";
import { competitionModel } from "../../../db/model/competition.model.js";
import { scoreModel } from "../../../db/model/score.model.js";
import { subscriberModel } from "../../../db/model/subscriber.model.js";
import { teamModel } from "../../../db/model/team.model.js";
import { catchAsyncError } from "../../utils/middleware/catchAsyncError.js";
import AppError from "../../utils/services/AppError.js";





export const getAllTeams=catchAsyncError(async(req,res,next)=>{
    let data=await teamModel.find({}).select("-password");
    res.json({message:"success",data});
    
})
export const delTeam=catchAsyncError(async(req,res,next)=>{
    let deleted=await teamModel.findByIdAndDelete(req.params.id);
    if(!deleted) return next(new AppError("Team not found",404));
    res.json({message:"success"});
})
export const checkIsAdmin=catchAsyncError(async(req,res,next)=>{
   let isAdmin=await adminModel.findById(req.user._id);
    if(isAdmin){
        res.json({status:true});
    } else {
        res.json({status:false});
    }
})




export const getEvntScores=catchAsyncError(async(req,res,next)=>{
    let data=await scoreModel.find({com_id:req.params.id}).populate("team_id","-password");
    let event=await competitionModel.findById(req.params.id);
    res.json({message:"success",event,data});
})
export const getEvntSubscribes=catchAsyncError(async(req,res,next)=>{
    let data=await subscriberModel.find({com_id:req.params.id}).populate("team_id","-password");
    let event=await competitionModel.findById(req.params.id);
    res.json({message:"success",event,data});
})



export const delEvent=catchAsyncError(async(req,res,next)=>{
    let deleted=await competitionModel.findByIdAndDelete(req.params.id);
    if(!deleted) return next(new AppError("Event not found",404));
    await scoreModel.findOneAndDelete({com_id:req.params.id});
    await subscriberModel.findOneAndDelete({com_id:req.params.id});
    res.json({message:"success"});
})


export const GetScoreDetails=catchAsyncError(async(req,res,next)=>{
    let data=await scoreModel.findOne({_id:req.params.id}).populate("com_id").populate("team_id","-password");
    res.json({message:"success",data});
})

export const GetTeamEvents=catchAsyncError(async(req,res,next)=>{
    let data=await scoreModel.find({team_id:req.params.id}).populate("com_id");
    let data2=await subscriberModel.find({team_id:req.params.id}).populate("com_id");
    let team=await teamModel.findById(req.params.id).select("-password");
    res.json({message:"success",team,data:[...data,...data2]});
})