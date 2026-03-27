import { Router } from "express";
import {
  selectCharity,
  getUserById,
  subscribeUser,
} from "../controllers/user.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/select-charity", verifyUser, selectCharity);
router.post("/subscribe", verifyUser, subscribeUser);
router.get("/:id", verifyUser, getUserById);

export default router;
