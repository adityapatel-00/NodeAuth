import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TokenType, verifyToken } from "../services/tokenService.js";
import User from "../models/user.js";
import { authSchema } from "../services/validationService.js";

export const authenticationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized", code: "INVALID_TOKEN" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const result = verifyToken(token, TokenType.Access);
    if (result.error) {
      throw result.error;
    }
    const { success, data } = authSchema.safeParse({
      email: result.payload?.email,
    });
    if (!success) {
      res.status(400).json({
        message: "Invalid Email",
      });
      return;
    }
    const userExists = await User.findOne({ email: data.email });
    if (!userExists) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }
    res.locals.email = result.payload?.email;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Token expired", code: "TOKEN_EXPIRED" });
      return;
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Invalid token", code: "INVALID_TOKEN" });
      return;
    }
    res.status(500).json({ message: "Authentication failed" });
  }
};
