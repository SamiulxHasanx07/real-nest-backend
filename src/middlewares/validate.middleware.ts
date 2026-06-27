import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { asyncHandler } from "../utils/asyncHandler";

export const validateRequest = (schema: ZodSchema<any>) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
      cookies: req.cookies,
    });
    
    // Assign validated data back to request to ensure type safety/defaults are applied
    // In Express 5, some req properties are getters, so we must use defineProperty
    Object.defineProperty(req, "body", { value: result.body, enumerable: true });
    Object.defineProperty(req, "query", { value: result.query, enumerable: true });
    Object.defineProperty(req, "params", { value: result.params, enumerable: true });
    Object.defineProperty(req, "cookies", { value: result.cookies, enumerable: true });

    next();
  });
