import { Router } from "express";
import { postLikes } from "../controllers/likes.controller.js";
import { tokenMiddleware } from "../middlewares/token.validation.middleware.js";

export const linksRouter = Router();

linksRouter.post("/likes", tokenMiddleware, postLikes)