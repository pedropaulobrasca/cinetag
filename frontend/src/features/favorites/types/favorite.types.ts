export interface Actor {
  name: string;
  character: string;
}

export interface Favorite {
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
  addedAt: string;
}

export interface AddFavoritePayload {
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

export interface FavoriteFilters {
  tag?: string;
  actor?: string;
  genre?: string;
  minRating?: number;
  sortBy?: 'rating' | 'addedAt';
  order?: 'asc' | 'desc';
  page?: number;
}

export interface PaginatedFavoritesResponse {
  data: Favorite[];
  total: number;
  page: number;
  totalPages: number;
}
