import { Router } from "express";
import { postCommentControl } from "../controllers/comments.controllers.js";
import { tokenMiddleware } from "../middlewares/token.validation.middleware.js";

const router = Router();

router.post("/comments", tokenMiddleware, postCommentControl);

export default router;