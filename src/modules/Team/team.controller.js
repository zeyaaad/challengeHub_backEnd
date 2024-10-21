import { teamModel } from "../../../db/model/team.model.js";
import { catchAsyncError } from "../../utils/middleware/catchAsyncError.js";
import  bcrypt  from 'bcrypt';
import AppError from "../../utils/services/AppError.js";
import { scoreModel } from "../../../db/model/score.model.js";




export const getData=catchAsyncError(async(req,res,next)=>{
    let data=await teamModel.findById(req.user._id).select("-password");
    res.json({message:"success",data});
})

export const chageData=catchAsyncError(async(req,res,next)=>{
    

    if(req.body.email){
        let isExist=await teamModel.findOne({email:req.body.email});
        
        if(isExist){
            if(req.user.email!=isExist.email){
                    
                return next(new AppError("The Email Already Exist",409))
            } 
        }
    }
    if(req.body.type==0){
        req.body.teamCount=1
        req.body.members=undefined;
    }
    await teamModel.findByIdAndUpdate(req.user._id,{...req.body});
    res.json({message:"success"});
})


export const changePassword=catchAsyncError(async(req,res,next)=>{
    
    let {currentpassword,password}=req.body
    let matched=await bcrypt.compare(currentpassword,req.user.password);
    if(matched){
        req.body.password = await bcrypt.hash(password, Number(process.env.ROUNDED));
        await teamModel.findByIdAndUpdate(req.user._id,{...req.body});
        return res.json({message:"success"})
    }else{
        return next(new AppError("Incorrect currunt Password",401));   
    }
})

export const getAllCompetation=catchAsyncError(async(req,res,next)=>{
    
    let data=await scoreModel.find({team_id:req.user._id}).populate("com_id");
    res.json({message:"success",data});
    
})

