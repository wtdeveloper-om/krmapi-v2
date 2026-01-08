import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/db.js";
import { verifyRefreshToken, generateRefreshToken, hashRefreshToken } from "../../utils/refreshToken.js";

export const refreshTokenController = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token required" });
  }

  const storedTokens = await prisma.refreshToken.findMany({
    include: { user: true },
  });

  for (const stored of storedTokens) {
    const isValid = await verifyRefreshToken(stored.tokenHash, refreshToken);

    if (!isValid) continue;

    // 🔄 Rotate refresh token
    await prisma.refreshToken.delete({ where: { id: stored.id } });

    const newRefreshToken = generateRefreshToken();
    const newRefreshTokenHash = await hashRefreshToken(newRefreshToken);

    await prisma.refreshToken.create({
      data: {
        tokenHash: newRefreshTokenHash,
        userId: stored.userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const accessToken = jwt.sign(
      {
        sub: stored.user.id,
        role: stored.user.role,
        tokenType: "access",
      },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    return res.json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  }

  return res.status(401).json({ message: "Invalid refresh token" });
};
