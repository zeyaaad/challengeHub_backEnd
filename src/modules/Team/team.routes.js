
import  express from 'express';
import { getData,chageData,changePassword,getAllCompetation } from './team.controller.js';
import { isAdmin, protectRoute } from '../auth/auth.controller.js';

const teamRouter=express.Router();


teamRouter.route("/")
    .get(protectRoute,getData)
    .put(protectRoute,chageData)

teamRouter.patch("/changePassword",protectRoute,changePassword)

teamRouter.get("/allCompetations",protectRoute,getAllCompetation)

export default teamRouter