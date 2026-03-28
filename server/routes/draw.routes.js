import { Router } from "express";
import { getDrawHistory, runDraw } from "../controllers/draw.controller.js";
import { verifyAdmin, verifyUser } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/run", verifyUser, verifyAdmin, runDraw);
router.get("/", verifyUser, getDrawHistory);

export default router;
