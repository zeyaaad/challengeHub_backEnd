import { teamModel } from "../../../db/model/team.model.js";

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { catchAsyncError } from "../../utils/middleware/catchAsyncError.js";
import AppError from "../../utils/services/AppError.js";
import { adminModel } from './../../../db/model/admin.model.js';
import { scoreModel } from './../../../db/model/score.model.js';


export const Register=catchAsyncError(async(req, res,next) => {
     let {email, password } = req.body;

    const emailParts = email.split("@");
    if (emailParts.length > 1) {
        email = `${emailParts[0]}@${emailParts[1].toLowerCase()}`;
    }
    req.body.email=email
    let exist = await teamModel.findOne({ email });
    if (exist) return  next(new AppError("Email team already Exist",409)) 

    let hashedPass = await bcrypt.hash(password, Number(process.env.ROUNDED));
    req.body.password=hashedPass
    let inserted = await teamModel.insertMany({ ...req.body });

    
    res.status(201).json({message:"success"})
})

export const Login=catchAsyncError(async(req, res,next) => {
     let { email, password } = req.body;

    const emailParts = email.split("@");
    if (emailParts.length > 1) {
        email = `${emailParts[0]}@${emailParts[1].toLowerCase()}`;
    }

    let exist = await teamModel.findOne({ email });

    if (!exist) {
        return next(new AppError("Wrong email or password",400)) 
    }

    let matched = await bcrypt.compare(password, exist.password);

    if (matched) {
        let token = jwt.sign({ name: exist.name, id: exist._id}, process.env.SECRET_KEY);
        return res.json({ message: "success", token });
    } else {
        return next(new AppError("Wrong email or password",400)) 
    }
})

export const adminLogin=catchAsyncError(async(req, res,next) => {
     let { email, password } = req.body;

    const emailParts = email.split("@");
    if (emailParts.length > 1) {
        email = `${emailParts[0]}@${emailParts[1].toLowerCase()}`;
    }

    let exist = await adminModel.findOne({ email });

    if (!exist) {
        return next(new AppError("Wrong email or password",400)) 
    }

    let matched = await bcrypt.compare(password, exist.password);

    console.log(exist);
    if (matched) {
        let token = jwt.sign({ name: exist.name, id: exist._id}, process.env.SECRET_KEY);
        return res.json({ message: "success", token });
    } else {
        return next(new AppError("Wrong email or password",400)) 
    }
})



export const protectRoute=catchAsyncError(async(req,res,next)=>{
    let {token}=req.headers;
    if(!token) return next(new AppError("must Provide token",400));

    let decoded=await jwt.verify(token,process.env.SECRET_KEY);

    let user=await teamModel.findById(decoded.id);
    let admin=await adminModel.findById(decoded.id);
    if(!user&&!admin) return next(new AppError("Invaild Token",400));

    if(user) req.user=user;
    if(admin) req.user=admin;
    next()
}) 








export const isAdmin=catchAsyncError(async(req,res,next)=>{
    
    let isAdmin=await adminModel.findById(req.user._id);
    if(isAdmin){
        next()
    } else {
        next(new AppError("unAuthrize",401));
    }
       
})


export const protectRouteFront=catchAsyncError(async(req,res,next)=>{
     let {token}=req.headers;
    if(!token) return res.json({status:false});

    let decoded=await jwt.verify(token,process.env.SECRET_KEY);

    let user=await teamModel.findById(decoded.id);
    let admin=await adminModel.findById(decoded.id);
    if(!user&&!admin) return  res.json({status:false});

     res.json({status:true});
})