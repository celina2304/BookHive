import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import RefreshTokenModel from "../models/refreshTokenModel";

import config from "../config/config";
import { Types } from "mongoose";

export const generateTokens = async (userId: string | Types.ObjectId) => {
  const _id = userId.toString();
  const accessToken = await bcrypt.hash(jwt.sign(
    { _id },
    config.JWT_ACCESS_SECRET!,
    { expiresIn: "15m" }
  ), 10);


  const refreshToken = await bcrypt.hash(jwt.sign(
    { _id },
    config.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" }
  ), 10);

  await RefreshTokenModel.create({
    userId: new Types.ObjectId(_id),
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  return { accessToken, refreshToken };
};
