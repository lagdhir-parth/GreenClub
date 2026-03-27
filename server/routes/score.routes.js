import { Router } from "express";
import { addScore } from "../controllers/score.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/add-score", verifyUser, addScore);

export default router;
