import express  from 'express'
import dotenv from "dotenv"
dotenv.config()
import cors from 'cors';
import morgan from 'morgan';
import dbConnection from './db/connection.js';
import authRouter from './src/modules/auth/auth.routes.js';
import { globalError } from './src/utils/middleware/globalError.js';
import AppError from './src/utils/services/AppError.js';
import competationRouter from './src/modules/competation/competation.routes.js';
import adminRouter from './src/modules/admin/admin.routes.js';
import scoreRouter from './src/modules/score/score.routes.js';
import teamRouter from './src/modules/Team/team.routes.js';

const app = express()
const port = 3000


 
dbConnection()

const corsOptions = {
  origin: 'https://challengehuub.vercel.app', 
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(morgan("dev"))



app.use("/api/auth/",authRouter)
app.use("/api/competation/",competationRouter)
app.use("/api/admin/",adminRouter)
app.use("/api/score/",scoreRouter)
app.use("/api/team/",teamRouter)




app.all("*",(req,res,next)=>{
    next(new AppError(`Invaild Url: ${req.originalUrl}`,404))

})


app.use(globalError)



app.listen(port, () => console.log(` app listening on port ${port}!`))