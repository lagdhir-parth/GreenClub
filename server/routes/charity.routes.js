import { Router } from "express";
import { getCharities } from "../controllers/charity.controller.js";
import { verifyAdmin, verifyUser } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/all", getCharities);

export default router;
