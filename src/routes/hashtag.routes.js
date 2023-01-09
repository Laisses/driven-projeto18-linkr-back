import { Router } from "express";
import { addHashtagControl, feedHashtagControl, trendingHashtagsControl, deleteHashtagControl } from "../controllers/hashtag.controllers.js";
import { tokenMiddleware } from "../middlewares/token.validation.middleware.js";

const router = Router();

router.get("/hashtag", tokenMiddleware, trendingHashtagsControl);
router.get("/hashtag/:hashtag", tokenMiddleware, feedHashtagControl);
router.post("/hashtag", tokenMiddleware, addHashtagControl);
router.delete("/hashtag/:postId", tokenMiddleware, deleteHashtagControl);

export default router;