import { Router } from "express";
import { signUp, signIn, logout, getUsers } from "../controllers/user.controller.js";

const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.delete("/logout", logout);
router.get("/users/:name", getUsers);

export default router;