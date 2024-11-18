import { z } from "zod";

const signUpSchema = z.object({
  firstName: z.string().min(3).max(255),
  lastName: z.string().min(3).max(255),
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be atleast 8 characters long")
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
      /^(?:\+?[1-9]\d{1,4}[-.\s]?)?(?:[(]\d{1,3}[)][-.\s]?)?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
      "Phone number must be a valid international or local number"
    ),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const authSchema = z.object({
  email: z.string().email(),
});

export { signUpSchema, loginSchema, authSchema };
