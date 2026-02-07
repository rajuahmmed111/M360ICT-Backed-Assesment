import { z } from 'zod';

export const createHrUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export type CreateHrUserInput = z.infer<typeof createHrUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
