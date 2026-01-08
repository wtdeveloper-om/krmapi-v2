import argon2 from "argon2";
import crypto from "crypto";

/**
 * Generate a secure random refresh token (plain)
 */
export const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

/**
 * Hash refresh token before storing
 */
export const hashRefreshToken = async (token: string) => {
  return argon2.hash(token);
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = async (
  hashedToken: string,
  token: string
) => {
  return argon2.verify(hashedToken, token);
};
