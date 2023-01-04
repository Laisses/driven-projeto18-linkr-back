import { Router } from "express";
import { trendingHashtagsControl } from "../controllers/hashtag.controllers.js";
import { trendingHashtagsMiddle } from "../middlewares/hashtag.middlewares.js";

const router = Router();

router.get("/hashtag", trendingHashtagsMiddle, trendingHashtagsControl);
router.get("/hashtag/:hashtag", );

export default router;