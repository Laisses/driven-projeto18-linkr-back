import { Router } from "express";
import { postLikes } from "../controllers/post.likes.controller.js";
import { tokenMiddleware } from "../middlewares/token.validation.middleware.js";

export const likesRouter = Router();

likesRouter.post("/likes", tokenMiddleware, postLikes);