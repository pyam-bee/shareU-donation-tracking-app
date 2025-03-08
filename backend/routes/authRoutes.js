import { Router } from "express";
import { signup, login, googleSignIn } from "../controllers/authController.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google-signin", googleSignIn);

export default router;