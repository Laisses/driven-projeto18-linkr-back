import { Router } from "express";
import { signUp, signIn, logout, getUsers, readUserPosts } from "../controllers/user.controller.js";
import { tokenMiddleware } from "../middlewares/token.validation.middleware.js";

const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.delete("/logout", logout);
router.get("/users/:name", tokenMiddleware, getUsers);
router.get("/user/:id", tokenMiddleware, readUserPosts)

export default router;