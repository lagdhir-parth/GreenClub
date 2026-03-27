import { Router } from "express";
import {
  getAllUsers,
  createCharity,
  deleteCharity,
  deleteUser,
} from "../controllers/admin.controller.js";
import { verifyAdmin, verifyUser } from "../middleware/auth.middleware.js";
const router = Router();

router.use(verifyUser); // Apply user verification to all routes in this router
router.use(verifyAdmin); // Apply admin verification to all routes in this router

router.get("/users", getAllUsers);
router.delete("/delete-user/:id", deleteUser);
router.post("/create-charity", createCharity);
router.delete("/delete-charity/:id", deleteCharity);

export default router;
