import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TokenType, verifyToken } from "../service/tokenService.js";

export const authenticationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
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
