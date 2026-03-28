import { Router } from "express";
import {
  addScore,
  getMyScores,
  deleteScore,
} from "../controllers/score.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyUser); // All routes require authentication

router.post("/add-score", addScore);
router.get("/my-scores", getMyScores);
router.delete("/delete-score/:id", deleteScore);

export default router;
