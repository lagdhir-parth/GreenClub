import { Router } from "express";
import { getAllUsers, createCharity } from "../controllers/admin.controller.js";
import { verifyAdmin } from "../middleware/auth.middleware.js";
const router = Router();

router.get("/users", verifyAdmin, getAllUsers);
router.post("/charities", verifyAdmin, createCharity);

export default router;
