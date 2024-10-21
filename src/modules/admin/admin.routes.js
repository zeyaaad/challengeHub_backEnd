import express from "express";
import {  getAllTeams ,checkIsAdmin,delTeam,getEvntScores,delEvent,GetScoreDetails,GetTeamEvents, getEvntSubscribes} from "./admin.contoller.js";
import { Register, isAdmin, protectRoute } from "../auth/auth.controller.js";

const adminRouter=express.Router();


adminRouter.get("/allTeams",protectRoute,isAdmin,getAllTeams);
adminRouter.post("/addTeam",protectRoute,isAdmin,Register);
adminRouter.delete("/delTeam/:id",protectRoute,isAdmin,delTeam);
adminRouter.get("/isAdmin",protectRoute,checkIsAdmin);

adminRouter.get("/getEvntScores/:id",protectRoute,isAdmin,getEvntScores);
adminRouter.get("/getEvntsubscribes/:id",protectRoute,isAdmin,getEvntSubscribes);
adminRouter.get("/scoreDetails/:id",protectRoute,isAdmin,GetScoreDetails);
adminRouter.get("/teamEvents/:id",protectRoute,isAdmin,GetTeamEvents);

adminRouter.delete("/delEvent/:id",protectRoute,isAdmin,delEvent);

export default adminRouter



