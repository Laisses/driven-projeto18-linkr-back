import { Router } from "express";
import { deletePost } from "../controllers/delete.post.controller.js";
import { tokenMiddleware } from "../middlewares/token.validation.middleware.js";

export const postsRouter = Router();

postsRouter.delete("/posts", tokenMiddleware, deletePost)