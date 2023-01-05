import { Router } from "express";
import * as c from "../controllers/posts.controller.js";
import * as s from "../schemas/posts.schemas.js";
import * as m from "../middlewares/posts.middleware.js";
import { tokenMiddleware } from "../middlewares/token.validation.middleware.js";

export const postsRouter = Router();

postsRouter.get("/timeline", tokenMiddleware, m.asyncError(c.readPosts));