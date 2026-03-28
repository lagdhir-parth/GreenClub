
import { Router } from "express";
import { getWinnings } from "../controllers/winning.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = Router();
router.use(verifyUser);
router.get("/", getWinnings);

export default router;
