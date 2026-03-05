import { tmdbClient } from '../../../lib/tmdb';
import {
  TmdbMovie,
  TmdbMovieCredits,
  TmdbMovieDetails,
  TmdbSearchResponse,
  TmdbGenreListResponse,
  TmdbDiscoverParams,
} from '../types/movie.types';

export const movieService = {
  async fetchPopular(page = 1): Promise<{ movies: TmdbMovie[]; totalPages: number }> {
    const response = await tmdbClient.get<TmdbSearchResponse>('/movie/popular', { params: { page } });
    return { movies: response.data.results, totalPages: response.data.total_pages };
  },

  async searchByTitle(query: string, page = 1): Promise<{ movies: TmdbMovie[]; totalPages: number }> {
    const response = await tmdbClient.get<TmdbSearchResponse>('/search/movie', {
      params: { query, page },
    });
    return { movies: response.data.results, totalPages: response.data.total_pages };
  },

  async fetchDiscover(params: TmdbDiscoverParams): Promise<{ movies: TmdbMovie[]; totalPages: number }> {
    const response = await tmdbClient.get<TmdbSearchResponse>('/discover/movie', {
      params: { sort_by: 'popularity.desc', ...params },
    });
    return { movies: response.data.results, totalPages: response.data.total_pages };
  },

  async fetchGenres(): Promise<TmdbGenreListResponse['genres']> {
    const response = await tmdbClient.get<TmdbGenreListResponse>('/genre/movie/list');
    return response.data.genres;
  },

  async fetchCredits(movieId: number): Promise<TmdbMovieCredits> {
    const response = await tmdbClient.get<TmdbMovieCredits>(`/movie/${movieId}/credits`);
    return response.data;
  },

  async fetchMovieDetails(movieId: number): Promise<TmdbMovieDetails> {
    const response = await tmdbClient.get<TmdbMovieDetails>(`/movie/${movieId}`);
    return response.data;
  },
};
