import express from "express"
import { isAdmin, protectRoute } from "../auth/auth.controller.js";
import { getAll, getHighScores } from "./score.controller.js";

const scoreRouter=express.Router();



scoreRouter.get("/:id",protectRoute,getAll)

scoreRouter.get("/high/:id",protectRoute,getHighScores) ;


export default scoreRouter