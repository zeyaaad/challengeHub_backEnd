

export const valdation=(shcema)=>{
    return (req,res,next)=>{    
        let inputs={...req.body,...req.params,...req.query};
        let{error}=shcema.validate(inputs,{abortEarly:false})
        if(error){
            let errors=error.details.map((err)=>err.message);
            res.status(400).json({message:"error",errors});
        } else {
            next()
        }
    }
}