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
    req.body = result.body;
    req.query = result.query;
    req.params = result.params;
    req.cookies = result.cookies;

    next();
  });
