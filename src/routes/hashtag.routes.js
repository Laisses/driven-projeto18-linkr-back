import { Router } from "express";
import { feedHashtagControl, trendingHashtagsControl } from "../controllers/hashtag.controllers.js";
import { tokenMiddleware } from "../middlewares/token.validation.middleware.js";

const router = Router();

router.get("/hashtag", tokenMiddleware, trendingHashtagsControl);
router.get("/hashtag/:hashtag", tokenMiddleware, feedHashtagControl);

export default router;