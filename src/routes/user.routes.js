import { Router } from "express";
import { signUp, signIn, logout, getUsers } from "../controllers/user.controller.js";
import { signUpJOI, signInJOI } from "../schemas/user.schemas.js";
import { validate } from "../middlewares/posts.middleware.js";

const router = Router();

router.post("/signup", validate(signUpJOI), signUp);
router.post("/signin", validate(signInJOI), signIn);
router.delete("/logout", logout);
router.get("/users/:name", getUsers);

export default router;