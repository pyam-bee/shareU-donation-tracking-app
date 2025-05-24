import { Router } from "express";
import { signup, login, googleSignIn, adminLogin, getAllUsers, disableUser, updateUser } from "../controllers/authController.js";
import { verifyAdmin, verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

// Authentication routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/google-signin", googleSignIn);
router.post("/admin-login", adminLogin);

// User management routes (admin only)
router.get("/", verifyAdmin, getAllUsers); // GET /api/auth - fetch all users
router.patch("/:id/disable", verifyAdmin, disableUser); // PATCH /api/auth/:id/disable
router.put("/:id", verifyAdmin, updateUser); // PUT /api/auth/:id - update user

export default router;