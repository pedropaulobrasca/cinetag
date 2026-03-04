import { z } from 'zod';

export const registerUserSchema = z.object({
  name: z.string().min(2, 'Name must have at least 2 characters').trim(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must have at least 6 characters'),
});

export const loginUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
