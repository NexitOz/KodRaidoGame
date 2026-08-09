import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username may only contain letters, numbers and underscore'),
  password: z.string().min(8).max(72),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const deckCardEntrySchema = z.object({
  cardId: z.string().min(1),
  quantity: z.number().int().min(1).max(2),
});

export const upsertDeckSchema = z.object({
  name: z.string().min(1).max(40),
  cards: z.array(deckCardEntrySchema).max(30),
});
export type UpsertDeckInput = z.infer<typeof upsertDeckSchema>;
