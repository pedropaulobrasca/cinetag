import { z } from 'zod';

const actorSchema = z.object({
  name: z.string().min(1),
  character: z.string().min(1),
});

export const addFavoriteSchema = z.object({
  tmdbId: z.number().int().positive('tmdbId must be a positive integer'),
  title: z.string().min(1, 'Title is required'),
  rating: z.number().min(0).max(10),
  posterPath: z.string().default(''),
  overview: z.string().default(''),
  releaseDate: z.string().default(''),
  genres: z.array(z.string()).default([]),
  runtime: z.number().int().min(0).default(0),
  actors: z.array(actorSchema).default([]),
  tags: z.array(z.string().min(1)).default([]),
});

export const updateFavoriteTagsSchema = z.object({
  tags: z.array(z.string().min(1)).min(0),
});

export const listFavoritesQuerySchema = z.object({
  tag: z.string().optional(),
  actor: z.string().optional(),
  genre: z.string().optional(),
  minRating: z.coerce.number().min(0).max(10).optional(),
  sortBy: z.enum(['rating', 'addedAt']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});
