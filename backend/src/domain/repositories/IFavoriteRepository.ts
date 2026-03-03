import { Favorite } from '../entities/Favorite';

export interface FavoriteFilters {
  tag?: string;
  actor?: string;
  genre?: string;
  minRating?: number;
  sortBy?: 'rating' | 'addedAt';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedFavorites {
  data: Favorite[];
  total: number;
  page: number;
  totalPages: number;
}

export interface IFavoriteRepository {
  findAllByUserId(userId: string, filters: FavoriteFilters): Promise<PaginatedFavorites>;
  findById(id: string): Promise<Favorite | null>;
  existsByUserIdAndTmdbId(userId: string, tmdbId: number): Promise<boolean>;
  save(favorite: Favorite): Promise<void>;
  update(favorite: Favorite): Promise<void>;
  delete(id: string): Promise<void>;
}
