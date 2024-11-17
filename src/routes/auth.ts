import { Router, Request, Response } from "express";
import User from "../models/user.js";
import { z } from "zod";
import { hash, verify } from "argon2";

import {
  generateRefreshToken,
  generateAccessToken,
  verifyToken,
  TokenType,
} from "../services/tokenService.js";

const authRouter: Router = Router();

const signUpSchema = z.object({
  firstName: z.string().min(3).max(255),
  lastName: z.string().min(3).max(255),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[@$*?&]/,
      "Password must contain at least one special character (@, $, *, ?, &)"
    ),
  phoneNumber: z
    .string()
    .regex(
      /^[6-9]\d{9}$/,
      "Phone number must be a valid number (starting with 6, 7, 8, or 9)"
    ),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const hashPassword = async (password: string): Promise<string> => {
  return await hash(password);
};

authRouter.post(
  "/signup",
  async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, email, password, phoneNumber } = req.body;
    try {
      const signUpValidation = signUpSchema.safeParse(req.body);
      if (!signUpValidation.success) {
        res.status(400).json({
          message: "Validation failed",
          errors: signUpValidation.error.errors.map((err) => err.message),
        });
        return;
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({
          message: "Email already exists!",
        });
        return;
      }

      const hashedPassword = await hashPassword(password);

      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phoneNumber,
      });

      await newUser.save();

      res.status(201).json({
        message: "Signed up successfully!",
      });
    } catch (error) {
      res.status(500).json({
        message: "Something went wrong. Try again!",
      });
    }
  }
);

authRouter.post(
  "/login",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const loginValidation = loginSchema.safeParse(req.body);
      if (!loginValidation.success) {
        res.status(400).json({
          message: "Validation failed",
          errors: loginValidation.error.errors,
        });
        return;
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        res.status(404).json({
          message: "User doesn't exist",
        });
        return;
      }

      const isPasswordValid = await verify(user.password, password);
      if (!isPasswordValid) {
        res.status(401).json({
          message: "Invalid credentials",
        });
        return;
      }

      const accessToken = generateAccessToken({ email });
      const refreshToken = generateRefreshToken({ email });

      res.status(200).json({
        message: "Login successful",
        data: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Something went wrong. Try again!",
      });
    }
  }
);

authRouter.get("/refresh-token", async (req: Request, res: Response) => {
  try {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      res.status(400).json({
        message: "Invalid token",
      });
      return;
    }
    const result = verifyToken(refreshToken, TokenType.Refresh);
    const email = result.payload?.email;

    const user = User.findOne({ email: email });
    if (!user) {
      res.status(401).json({
        message: "User doesn't exist",
      });
      return;
    }
    const newAccessToken = generateAccessToken({ email });
    res.status(200).json({
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong. Try again!",
    });
  }
});

export default authRouter;
