import { Router } from "express";
import {
  getCharities,
  deleteCharity,
} from "../controllers/charity.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/all", getCharities);
router.delete("/:id", verifyUser, deleteCharity);

export default router;
