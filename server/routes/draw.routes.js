import { Router } from "express";
import { runDraw } from "../controllers/draw.controller.js";
import { verifyAdmin, verifyUser } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/run", verifyUser, verifyAdmin, runDraw);

export default router;
