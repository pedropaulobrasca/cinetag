import { Actor } from '../../domain/entities/Favorite';

export interface AddFavoriteInput {
  userId: string;
  tmdbId: number;
  title: string;
  rating: number;
  posterPath: string;
  overview: string;
  releaseDate: string;
  genres: string[];
  runtime: number;
  actors: Actor[];
  tags: string[];
}

export interface FavoriteOutput {
  id: string;
  userId: string;
  tmdbId: number;
  title: string;
  rating: number;
  posterPath: string;
  overview: string;
  releaseDate: string;
  genres: string[];
  runtime: number;
  actors: Actor[];
  tags: string[];
  addedAt: Date;
}

export interface ListFavoritesInput {
  userId: string;
  tag?: string;
  actor?: string;
  genre?: string;
  minRating?: number;
  sortBy?: 'rating' | 'addedAt';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedFavoritesOutput {
  data: FavoriteOutput[];
  total: number;
  page: number;
  totalPages: number;
}

export interface UpdateFavoriteTagsInput {
  favoriteId: string;
  requestingUserId: string;
  tags: string[];
}

export interface RemoveFavoriteInput {
  favoriteId: string;
  requestingUserId: string;
}
