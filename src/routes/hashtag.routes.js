import { Router } from "express";
import { trendingHashtagsControl } from "../controllers/hashtag.controllers.js";
import { tokenMiddleware } from "../middlewares/token.validation.middleware.js";

const router = Router();

router.get("/hashtag", tokenMiddleware, trendingHashtagsControl);
router.get("/hashtag/:hashtag", );

export default router;