import { useCallback, useEffect, useState } from 'react';
import { movieService } from '../services/movieService';
import { TmdbMovie, TmdbGenre } from '../types/movie.types';

const DEBOUNCE_DELAY_MS = 400;

export function useMovieSearch() {
  const [query, setQuery] = useState('');
  const [genreId, setGenreId] = useState<number | undefined>(undefined);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState<TmdbMovie[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [genres, setGenres] = useState<TmdbGenre[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch genres once on mount
  useEffect(() => {
    movieService.fetchGenres().then(setGenres).catch(() => {});
  }, []);

  const fetchMovies = useCallback(async (searchQuery: string, gId?: number, mRating?: number, p = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      let result: { movies: TmdbMovie[]; totalPages: number };
      if (searchQuery.trim()) {
        // Search mode: TMDB search doesn't support genre/rating filters
        result = await movieService.searchByTitle(searchQuery.trim(), p);
      } else if (gId || mRating) {
        // Discover mode: supports genre and rating filters
        result = await movieService.fetchDiscover({
          with_genres: gId,
          'vote_average.gte': mRating,
          page: p,
        });
      } else {
        result = await movieService.fetchPopular(p);
      }
      setMovies(result.movies);
      setTotalPages(Math.min(result.totalPages, 500)); // TMDB caps at 500 pages
    } catch {
      setError('Não foi possível carregar os filmes.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Reset page when query/genre/minRating changes
  useEffect(() => {
    setPage(1);
  }, [query, genreId, minRating]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMovies(query, genreId, minRating, page);
    }, query.trim() ? DEBOUNCE_DELAY_MS : 0);

    return () => clearTimeout(timer);
  }, [query, genreId, minRating, page, fetchMovies]);

  return {
    query,
    setQuery,
    genreId,
    setGenreId,
    minRating,
    setMinRating,
    page,
    setPage,
    movies,
    totalPages,
    genres,
    isLoading,
    error,
  };
}
