import { Router } from "express";
import { getUsers } from "../controllers/users.controller.js";

const router = Router()

router.get("/users/:name", getUsers)

export default router