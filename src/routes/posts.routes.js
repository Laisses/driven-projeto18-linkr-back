import { Router } from "express";
import { deletePost } from "../controllers/delete.post.controller.js";
import * as c from "../controllers/posts.controller.js";
import * as s from "../schemas/posts.schemas.js";
import * as m from "../middlewares/posts.middleware.js";
import { tokenMiddleware } from "../middlewares/token.validation.middleware.js";

export const postsRouter = Router();

postsRouter.get("/timeline", tokenMiddleware, m.asyncError(c.readPosts));
postsRouter.post("/timeline", tokenMiddleware, m.validate(s.post), m.asyncError(c.postLink));
postsRouter.put("/timeline", tokenMiddleware, m.validate(s.newDescription), m.validatePostEdit, m.asyncError(c.editDescription));
postsRouter.delete("/timeline/:id", tokenMiddleware, deletePost);