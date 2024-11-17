import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET!;
const emailTokenSecret = process.env.EMAIL_TOKEN_SECRET!;
const accessTokenExpiry = process.env.ACCESS_TOKEN_VALIDITY;
const refreshTokenExpiry = process.env.REFRESH_TOKEN_VALIDITY;

export enum TokenType {
  Access = "access",
  Refresh = "refresh",
  Email = "email",
}

interface TokenVerificationResult {
  payload: JwtPayload | null;
  error: VerifyErrors | null;
}

export const generateAccessToken = (payload: object): string => {
  return jwt.sign({ type: "access", ...payload }, accessTokenSecret, {
    expiresIn: accessTokenExpiry,
  });
};

export const generateRefreshToken = (payload: object): string => {
  return jwt.sign({ type: "refresh", ...payload }, refreshTokenSecret, {
    expiresIn: refreshTokenExpiry,
  });
};

export const generateEmailToken = (payload: object): string => {
  return jwt.sign({ type: "email", ...payload }, emailTokenSecret, {
    expiresIn: "10d",
  });
};

export const verifyToken = (
  token: string,
  type: TokenType
): TokenVerificationResult => {
  try {
    let secret = "";
    switch (type) {
      case TokenType.Access:
        secret = accessTokenSecret;
        break;
      case TokenType.Refresh:
        secret = refreshTokenSecret;
        break;
      case TokenType.Email:
        secret = emailTokenSecret;
        break;
      default:
        throw new Error("Invalid token type");
    }

    const payload = jwt.verify(token, secret) as JwtPayload;
    return { payload, error: null };
  } catch (error) {
    return {
      payload: null,
      error: error as VerifyErrors,
    };
  }
};
