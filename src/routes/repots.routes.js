import { Router } from "express";
import { postReposts } from "../controllers/post.reposts.controller.js";
import { tokenMiddleware } from "../middlewares/token.validation.middleware.js";

export const repostsRouter = Router();

repostsRouter.post("/reposts", tokenMiddleware, postReposts);