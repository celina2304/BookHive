import { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";
import type { AuthPayload } from "../auth";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload; 
    }
  }
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

