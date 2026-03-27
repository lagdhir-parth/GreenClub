import { Router } from "express";
import {
  selectCharity,
  getUserProfile,
} from "../controllers/user.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/select-charity", verifyUser, selectCharity);
router.get("/profile", verifyUser, getUserProfile);

export default router;
