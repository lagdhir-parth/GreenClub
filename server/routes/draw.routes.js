import { Router } from "express";
import { runDraw } from "../controllers/draw.controller.js";

const router = Router();

router.post("/run", runDraw);

export default router;
