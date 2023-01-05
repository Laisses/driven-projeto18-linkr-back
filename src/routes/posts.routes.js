import { Router } from "express";
import { deletePost } from "../controllers/delete.post.controller.js";
import * as c from "../controllers/posts.controller.js";
import * as s from "../schemas/posts.schemas.js";
import * as m from "../middlewares/posts.middleware.js";
import { tokenMiddleware } from "../middlewares/token.validation.middleware.js";

export const postsRouter = Router();

postsRouter.delete("/posts", tokenMiddleware, deletePost)
postsRouter.get("/timeline", tokenMiddleware, m.asyncError(c.readPosts));
