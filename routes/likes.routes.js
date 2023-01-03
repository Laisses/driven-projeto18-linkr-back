import { Router } from "express";
import { getLikes } from "../controllers/likes.controller.js";
import { tokenMiddleware } from "../middlewares/token.validation.middleware.js";

export const linksRouter = Router();

linksRouter.get("/likes", tokenMiddleware, getLikes);