import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { verifyToken } from "../utils/jwt";
import { env } from "../config/env";
import { asyncHandler } from "../utils/asyncHandler";

export const authMiddleware = (...requiredRoles: string[]) => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // 1. Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "You are not logged in. Please provide a valid token.");
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify token
    try {
      const decoded = verifyToken(token, env.JWT_ACCESS_SECRET);
      
      // 3. Check if user role is authorized
      if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
        throw new ApiError(403, "You do not have permission to access this resource");
      }

      req.user = decoded;
      next();
    } catch (err) {
      throw new ApiError(401, "Invalid or expired access token");
    }
  });
};
