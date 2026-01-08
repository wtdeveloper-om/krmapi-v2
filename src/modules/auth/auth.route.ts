import { Router } from "express";
import { googleAuthController, verifyOtpController } from "./auth.controller.js";
import { refreshTokenController } from "./auth.refresh.controller.js";

const router = Router();

router.post("/google", googleAuthController);
router.post("/verify-otp", verifyOtpController);
router.post("/refresh-token", refreshTokenController);

export default router;
