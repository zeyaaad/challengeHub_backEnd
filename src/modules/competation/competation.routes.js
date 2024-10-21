import express from "express";
import { Subscribe, createCom, getAll, getOne, sendAnswers, unSubscribe,Search, getJoinedcompetation } from "./competation.controller.js";
import { isAdmin, protectRoute } from './../auth/auth.controller.js';

const competationRouter=express.Router();




competationRouter.get("/joined-events",protectRoute,getJoinedcompetation) ;
competationRouter.route("/")
        .post(protectRoute,isAdmin,createCom)
        .get(protectRoute,getAll)

competationRouter.route("/:id")
        .get(protectRoute,getOne)       

competationRouter.post("/sendAnswers",protectRoute,sendAnswers)

competationRouter.post("/subscribe",protectRoute,Subscribe);
competationRouter.post("/unSubscribe",protectRoute,unSubscribe);
competationRouter.get("/search/:word",protectRoute,Search) ;
export default competationRouter