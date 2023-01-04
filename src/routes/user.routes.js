import express from "express";
import { signUp, signIn, logout } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.delete("/logout", logout);

export default router;