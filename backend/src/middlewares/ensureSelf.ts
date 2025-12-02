import { Request, Response, NextFunction } from "express";

export const ensureSelf = (req: Request, res: Response, next: NextFunction) => {
  const userIdFromToken = req.user?._id?.toString();
  const userIdFromParams = req.params._id;

  if (!userIdFromToken) {
    return res.status(401).json({ message: "Unauthorized: no user info" });
  }

  if (userIdFromToken !== userIdFromParams) {
    return res.status(403).json({ message: "Forbidden: cannot act on another user" });
  }

  next();
};
