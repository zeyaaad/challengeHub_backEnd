import express from "express";
import { Login, Register, adminLogin ,protectRouteFront} from "./auth.controller.js";
import { valdation } from "../../utils/middleware/valdation.js";
import { registerSchema ,loginSchema} from "./auth.valdation.js";

const authRouter= express.Router();


authRouter.post("/register",Register)
authRouter.post("/login",valdation(loginSchema),Login)
authRouter.post("/admin-login",adminLogin)
authRouter.get("/protectRoute",protectRouteFront)





export default authRouter