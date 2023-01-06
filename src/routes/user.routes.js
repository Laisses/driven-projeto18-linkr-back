import { Router } from "express";
import { signUp, signIn, logout } from "../controllers/user.controller.js";

export const userRouter = Router();

userRouter.post("/signup", signUp);
userRouter.post("/signin", signIn);
userRouter.delete("/logout", logout);