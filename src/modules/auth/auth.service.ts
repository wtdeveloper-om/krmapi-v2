import admin from "../../config/firebase.js";
import { prisma } from "../../config/db.js";
import jwt from "jsonwebtoken";
import {
  generateRefreshToken,
  hashRefreshToken,
} from "../../utils/refreshToken.js";

const createAccessToken = (user: any) =>
  jwt.sign(
    {
      sub: user.id,
      role: user.role,
      tokenType: "access", // ✅ ADD THIS
    },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );


/**
 * GOOGLE LOGIN
 */
export const googleLogin = async (firebaseIdToken: string) => {
  const decoded = await admin.auth().verifyIdToken(firebaseIdToken);
  const { uid, email, name, picture } = decoded;

  if (!uid) throw new Error("Invalid Firebase token");

  let user = await prisma.user.findUnique({
    where: { googleOAuth: uid },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: name ?? "User",
        email,
        googleOAuth: uid,
        googleVerified: true,
        mobileVerified: false,
        profilePic: picture,
      },
    });
  }

  if (!user.mobileVerified) {
    return { mobileVerified: false };
  }

  const accessToken = createAccessToken(user);
  const refreshToken = generateRefreshToken();
  const refreshTokenHash = await hashRefreshToken(refreshToken);

  await prisma.refreshToken.deleteMany({
    where: { userId: user.id },
  });

  await prisma.refreshToken.create({
    data: {
      tokenHash: refreshTokenHash,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    mobileVerified: true,
    tokens: { accessToken, refreshToken },
  };
};

/**
 * PHONE VERIFICATION
 */
export const verifyPhoneLogin = async (firebaseIdToken: string) => {
  const decoded = await admin.auth().verifyIdToken(firebaseIdToken);
  const { uid, phone_number } = decoded;

  if (!uid || !phone_number) {
    throw new Error("Phone not verified");
  }

  const user = await prisma.user.update({
    where: { googleOAuth: uid },
    data: {
      mobile: phone_number,
      mobileVerified: true,
    },
  });

  const accessToken = createAccessToken(user);
  const refreshToken = generateRefreshToken();
  const refreshTokenHash = await hashRefreshToken(refreshToken);

  await prisma.refreshToken.create({
    data: {
      tokenHash: refreshTokenHash,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { accessToken, refreshToken };
};