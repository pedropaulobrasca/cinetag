export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
}

export interface TmdbCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface TmdbMovieCredits {
  id: number;
  cast: TmdbCastMember[];
}

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbMovieDetails {
  id: number;
  runtime: number | null;
  genres: TmdbGenre[];
}

export interface TmdbSearchResponse {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
}

export interface TmdbGenreListResponse {
  genres: TmdbGenre[];
}

export interface TmdbDiscoverParams {
  with_genres?: number;
  'vote_average.gte'?: number;
  sort_by?: string;
  page?: number;
}
