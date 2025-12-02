import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthPayload } from "../types/auth";
import config from "../config/config";

export const checkAccessToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ error: "No token" });

  const token = authHeader.split(" ")[1];
  if(!token){
    throw new Error("Invalid token !");
  }
  try {
    const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET!) as AuthPayload;
    req.user = decoded; // contains id + role
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Access token expired" });
    }
    return res.status(403).json({ error: "Invalid token" });
  }
};