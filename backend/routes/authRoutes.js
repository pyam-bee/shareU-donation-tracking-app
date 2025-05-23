import { Router } from "express";
import { signup, login, googleSignIn, adminLogin } from "../controllers/authController.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google-signin", googleSignIn);
router.post("/admin-login", adminLogin); // Add admin-specific login route

export default router;