import { competitionModel } from "../../../db/model/competition.model.js";
import { equationModel } from "../../../db/model/equation.model.js";
import { scoreModel } from "../../../db/model/score.model.js";
import { subscriberModel } from "../../../db/model/subscriber.model.js";
import { catchAsyncError } from "../../utils/middleware/catchAsyncError.js";
import AppError from "../../utils/services/AppError.js";



export const createCom=catchAsyncError(async(req,res,next)=>{
    let isExist=await competitionModel.findOne({name:req.body.name}) ;
    if(isExist) return next(new AppError("The competation Name already exist !",409));
    let com=await competitionModel.insertMany(req.body) ;
    if(req.body.eqs){
        req.body.eqs.forEach(async(element) => {
            await equationModel.insertMany(
                {com_id:com[0]._id,...element}
                );
            });
    }

    res.json({message:"success",id:com[0]._id});

})

export const getAll = catchAsyncError(async (req, res, next) => {
    let all = await competitionModel.find({});

    all = await Promise.all(all.map(async (comp) => {
        let isJoined = await scoreModel.findOne({ team_id: req.user._id, com_id: comp._id });
        let isSubscribe = await subscriberModel.findOne({ team_id: req.user._id, com_id: comp._id });
        
        comp = comp.toObject();
        
        comp.joined = isJoined || isSubscribe ? true : false;
        
        let scoreCount = await scoreModel.countDocuments({ com_id: comp._id, oqbj: { $ne: true } });
        let subscriberCount = await subscriberModel.countDocuments({ com_id: comp._id, oqbj: { $ne: true } });
        
        comp.allMembers = scoreCount + subscriberCount;
        
        return comp;
    }));

    res.json({ message: "success", data: all });
});



export const getOne=catchAsyncError(async(req,res,next)=>{
    let {id}=req.params;
    
    let isDo=await scoreModel.findOne({com_id:id,team_id:req.user._id});
    if(isDo) return next(new AppError("You are Already joined",400));

    
    let com=await competitionModel.findById(id);
    if(!com) return next(new AppError("Competation not found",404));
    let isSubscribe = await subscriberModel.findOne({ team_id: req.user._id, com_id: id });
    com = com.toObject(); 
    com.joined =isSubscribe ? true : false;
    let equations=await equationModel.find({com_id:com._id}).select("-true_answer");
    res.json({message:"success",data:com,equations});

})



//  comId,answers->[{eqId,answer},{eqId,answer},{eqId,answer}]

export const sendAnswers=catchAsyncError(async(req,res,next)=>{
    let {com_id,answers}=req.body ;

    let isExist=await competitionModel.findById(com_id);
    if(!isExist) return next(new AppError("The competation not found ",404));
    if(isExist.type==0){
        return next(new AppError("can't do because competation offline! ",400));
    }
    let isDo=await scoreModel.findOne({com_id,team_id:req.user._id});
    if(isDo) return next(new AppError("Already Answerd at this competation",409));


    let results=await calcScores(com_id,answers,isExist.eqDegree||5);
    let added=await scoreModel.insertMany({com_id,team_id:req.user._id,final_result:results[0],true_eqs:results[1],false_eqs:results[2]});
    res.json({message:"success",data:added});

})



export const Subscribe=catchAsyncError(async(req,res,next)=>{
    let{com_id}=req.body;
     let isExist=await competitionModel.findById(com_id);
    if(!isExist) return next(new AppError("The competation not found ",404));
    if(isExist.type==1){
        return next(new AppError("can't do because competation online! ",400));
    }
    let isDo=await subscriberModel.findOne({com_id,team_id:req.user._id});
    if(isDo) return next(new AppError("Already subscribed at this competation",409));

    await subscriberModel.insertMany({com_id,team_id:req.user._id});
    res.json({message:"success"});
})
export const unSubscribe=catchAsyncError(async(req,res,next)=>{
    let{com_id}=req.body;
    let isExist=await competitionModel.findById(com_id);
    if(!isExist) return next(new AppError("The competation not found ",404));
    if(isExist.type==1){
        return next(new AppError("can't do because competation online! ",400));
    }
    let isDo=await subscriberModel.findOne({com_id,team_id:req.user._id});
    if(!isDo) return next(new AppError("Already not subscribed at this competation",409));

    await subscriberModel.findOneAndDelete({com_id,team_id:req.user._id});
    res.json({message:"success"});
})



export const Search=catchAsyncError(async(req,res,next)=>{ 
  let data = await competitionModel.find({
            $or: [
                { name: { $regex:req.params.word , $options: "i" } },
            ]
    });
 data = await Promise.all(data.map(async (comp) => {
        let isJoined = await scoreModel.findOne({ team_id: req.user._id, com_id: comp._id });
        let isSubscribe = await subscriberModel.findOne({ team_id: req.user._id, com_id: comp._id });
        comp = comp.toObject(); 
        comp.joined = isJoined||isSubscribe ? true : false;
        return comp;
    }));
  res.json({message:"success",data});
})




export const getJoinedcompetation=catchAsyncError(async(req,res,next)=>{
    let online=await scoreModel.find({team_id:req.user._id}).populate("com_id","name desc type ")
    let offline=await subscriberModel.find({team_id:req.user._id}).populate("com_id","name desc type ")
    res.json({message:"success",data:[...online,...offline]});
})



















async function calcScores(com_id, answers, count) { 
    let trueAnswers = [];
    let falseAnswers = [];
    let results = 0;

    let equations = await equationModel.find({ com_id: com_id }); 

    equations.forEach((eq) => {
        answers.forEach((ans) => {
            if (ans._id == eq._id) {
                if (eq.true_answer == ans.answer) {
                    results += count;  
                    trueAnswers.push(eq); 
                } else {
                    eq = { ...eq._doc, your_answer: ans.answer };  
                    console.log(eq);
                    falseAnswers.push(eq);  
                }
            }
        });
    });

    return [ results, trueAnswers, falseAnswers ]; 
}


