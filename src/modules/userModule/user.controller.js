import { Router } from "express";
import { getProfile, login, signup } from "./user.services.js";

export const authRouter = Router();
export const userOperationRouter = Router();



authRouter.post("/login",login);
authRouter.post("/signup",signup);
userOperationRouter.get("/profile",getProfile);