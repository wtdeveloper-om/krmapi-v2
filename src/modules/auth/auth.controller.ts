import { googleLogin, verifyPhoneLogin } from "./auth.service.js";
import { Request, Response } from "express";

export const googleAuthController = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "ID token required" });
    }

    const result = await googleLogin(idToken);

    if (!result.mobileVerified) {
      return res.status(200).json({
        step: "VERIFY_MOBILE",
      });
    }

    return res.status(200).json({
      step: "LOGIN",
      tokens: result.tokens,
    });

  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Authentication failed" });
  }
};

export const verifyOtpController = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "ID token required" });
    }

    const tokens = await verifyPhoneLogin(idToken);

    return res.status(200).json({
      step: "LOGIN",
      tokens,
    });

  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Authentication failed" });
  }
};