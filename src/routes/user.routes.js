import { Router } from "express";
import { signUpJOI, signInJOI } from "../schemas/user.schemas.js";
import { validate } from "../middlewares/posts.middleware.js";
import { signUp, signIn, logout, getUsers, readUserPosts } from "../controllers/user.controller.js";
import { tokenMiddleware } from "../middlewares/token.validation.middleware.js";

const router = Router();

router.post("/signup", validate(signUpJOI), signUp);
router.post("/signin", validate(signInJOI), signIn);
router.delete("/logout", logout);
router.get("/users/:name", tokenMiddleware, getUsers);
router.get("/user/:id", tokenMiddleware, readUserPosts)

export default router;