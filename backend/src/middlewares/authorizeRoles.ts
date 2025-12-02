import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import { AuthPayload } from "../types/auth";

export const authorizeRoles = (...allowedRoles: AuthPayload["role"][]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?._id) {
        return res.status(401).json({ error: "Unauthorized: no user info", user: req.user });
      }

      // always fetch user from DB to confirm role
      const dbUser = await User.findById(req.user._id).select("role");
      
      if (!dbUser) {
        return res.status(401).json({ error: "Unauthorized: user not found" });
      }

      if (!allowedRoles.includes(dbUser.role)) {
        return res.status(403).json({ error: "Forbidden: insufficient role" });
      }

      next();
    } catch (err) {
      console.error("Role authorization error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
};
