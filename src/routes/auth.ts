import { Router, Request, Response } from "express";
import { hash, verify } from "argon2";
import jwt from "jsonwebtoken";

import { prismaClient } from "../utils/db.js";
import {
  generateRefreshToken,
  generateAccessToken,
  verifyToken,
  TokenType,
} from "../services/tokenService.js";
import {
  authSchema,
  loginSchema,
  signUpSchema,
} from "../services/validationService.js";
import sendVerificationEmail from "../services/emailService.js";

const authRouter: Router = Router();

const hashPassword = async (password: string): Promise<string> => {
  return await hash(password);
};

authRouter.post(
  "/signup",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { success, data, error } = signUpSchema.safeParse(req.body);
      if (!success) {
        res.status(400).json({
          message: "Please provide valid information.",
          errors: error.errors.map((err) => err.message),
        });
        return;
      }

      const { firstName, lastName, email, password, phoneNumber } = data;

      const existingUser = await prismaClient.user.findUnique({
        where: {
          email,
        },
      });
      if (existingUser) {
        res.status(400).json({
          message: "Email already exists!",
        });
        return;
      }

      const hashedPassword = await hashPassword(password);

      await prismaClient.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          phoneNumber,
        },
      });

      sendVerificationEmail(email);

      res.status(201).json({
        message: "Signed up successfully and verification mail sent!",
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
      const { success, data, error } = loginSchema.safeParse(req.body);
      if (!success) {
        res.status(400).json({
          message: "Please provide valid data",
          errors: error.errors,
        });
        return;
      }

      const { email, password } = data;

      const existingUser = await prismaClient.user.findUnique({
        where: {
          email,
        },
      });
      if (!existingUser) {
        res.status(404).json({
          message: "User doesn't exist",
        });
        return;
      }

      const isPasswordValid = await verify(existingUser.password, password);
      if (!isPasswordValid) {
        res.status(401).json({
          message: "Invalid credentials",
        });
        return;
      }

      if (!existingUser.isVerified) {
        res.status(401).json({
          message: "User not verified",
          code: "NOT_VERIFIED",
        });
        return;
      }

      const accessToken = generateAccessToken({ email });
      const refreshToken = generateRefreshToken({ email });

      await prismaClient.user.update({
        data: {
          lastLogin: new Date(),
        },
        where: {
          email,
        },
      });

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
        message: "Unauthorized",
      });
      return;
    }
    const result = verifyToken(refreshToken, TokenType.Refresh);
    if (result.error) {
      throw result.error;
    }
    const email = result.payload?.email;

    const existingUser = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });
    if (!existingUser) {
      res.status(404).json({
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
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Login again", code: "LOGIN_EXPIRED" });
      return;
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Invalid token", code: "INVALID_TOKEN" });
      return;
    }
    res.status(500).json({ message: "Authentication failed" });
  }
});

authRouter.post("/verification/:token", async (req: Request, res: Response) => {
  try {
    const token = req.params.token;
    if (!token) {
      res.status(400).json({
        message: "Unauthorized",
      });
      return;
    }
    const result = verifyToken(token, TokenType.Email);
    if (result.error) {
      throw result.error;
    }
    const email = result.payload?.email;

    const existingUser = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });
    if (!existingUser) {
      res.status(404).json({
        message: "User doesn't exist",
      });
      return;
    }
    if (existingUser.isVerified) {
      res.status(400).json({
        message: "User already verified!",
      });
      return;
    }

    await prismaClient.user.update({
      data: {
        isVerified: true,
      },
      where: {
        email,
      },
    });

    res.status(200).json({
      message: "Verified Successfully!",
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        message: "Verification window expired",
      });
      return;
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Invalid verification" });
      return;
    }
    res.status(500).json({
      message: "Something went Wrong",
    });
  }
});

authRouter.post("/verification", async (req: Request, res: Response) => {
  try {
    const { success, data } = authSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({
        message: "Invalid Email",
      });
      return;
    }

    const existingUser = await prismaClient.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!existingUser) {
      res.status(404).json({
        message: "User doesn't exist",
      });
      return;
    }
    if (existingUser.isVerified) {
      res.status(400).json({
        message: "User already verified!",
      });
      return;
    }
    sendVerificationEmail(data.email);
    res.status(200).json({
      message: "Verification email sent!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong. Try again!",
    });
  }
});

export default authRouter;
