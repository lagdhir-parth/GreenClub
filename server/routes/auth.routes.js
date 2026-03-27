import { Router } from "express";
import {
  login,
  logout,
  register,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/current-user", verifyUser, getCurrentUser);

export default router;
