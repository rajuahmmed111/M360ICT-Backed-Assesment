import { z } from "zod";

const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6),
  }),
});

export const AuthValidation = {
  loginSchema,
};