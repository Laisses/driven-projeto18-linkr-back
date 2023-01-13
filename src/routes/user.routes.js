import { Router } from "express";
import { signUpJOI, signInJOI } from "../schemas/user.schemas.js";
import { validate } from "../middlewares/posts.middleware.js";
import { signUp, signIn, logout, getUsers, readUserPosts, followUser, getFollowingUsers, unfollowUser, getUserData } from "../controllers/user.controller.js";
import { tokenMiddleware } from "../middlewares/token.validation.middleware.js";

const router = Router();

router.post("/signup", validate(signUpJOI), signUp);
router.post("/signin", validate(signInJOI), signIn);
router.delete("/logout", logout);
router.get("/users/:name", tokenMiddleware, getUsers);
router.get("/user/:id", tokenMiddleware, readUserPosts);
router.post("/follow/:id", tokenMiddleware, followUser);
router.delete("/unfollow/:id", tokenMiddleware, unfollowUser)
router.get("/following", tokenMiddleware, getFollowingUsers)
router.get("/userData/:id", tokenMiddleware, getUserData)


export default router;