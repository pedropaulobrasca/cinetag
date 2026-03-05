import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Film, CheckCircle2, Search, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMovieSearch } from '../../features/movies/hooks/useMovieSearch';
import { useFavoritesStore } from '../../features/favorites/store/useFavoritesStore';
import { TmdbMovie } from '../../features/movies/types/movie.types';
import { MovieCard } from '../../components/MovieCard';
import { AddToFavoritesModal } from '../../components/AddToFavoritesModal';
import { MovieDetailModal } from '../../components/MovieDetailModal';
import { Input } from '../../components/ui/Input';
import { Spinner } from '../../components/ui/Spinner';
import { useAuth } from '../../features/auth/hooks/useAuth';

const MIN_RATING_OPTIONS = [
  { label: 'Qualquer nota', value: undefined },
  { label: '≥ 6.0', value: 6 },
  { label: '≥ 7.0', value: 7 },
  { label: '≥ 7.5', value: 7.5 },
  { label: '≥ 8.0', value: 8 },
];

export function HomePage() {
  const { user, logout } = useAuth();
  const {
    query, setQuery,
    genreId, setGenreId,
    minRating, setMinRating,
    page, setPage,
    movies, totalPages,
    genres,
    isLoading, error,
  } = useMovieSearch();
  const { favorites } = useFavoritesStore();

  const [detailMovie, setDetailMovie] = useState<TmdbMovie | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<TmdbMovie | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const favoritedTmdbIds = new Set(favorites.map((f) => f.tmdbId));

  const handleFavoriteAdded = () => {
    setSuccessMessage('Filme adicionado aos favoritos!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleFavoriteFromDetail = () => {
    if (detailMovie) {
      setSelectedMovie(detailMovie);
      setDetailMovie(null);
    }
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filtersDisabledInSearch = query.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-surface-primary"
    >
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="sticky top-0 z-40 border-b border-white/5 bg-surface-secondary/80 backdrop-blur-md shadow-glass"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-white tracking-tight">
            <Film className="h-6 w-6 text-accent" />
            Cine<span className="text-accent">Tag</span>
          </h1>

          <div className="flex items-center gap-4">
            <Link
              to="/minha-lista"
              className="group flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-white transition-colors"
            >
              Minha Lista
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-accent"></span>
            </Link>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-card border border-white/5">
              <span className="text-sm font-medium text-text-primary">{user?.name}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-full p-2 text-text-muted hover:text-accent hover:bg-surface-card transition-all"
              title="Sair"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.header>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mx-auto max-w-7xl px-4 py-8"
      >
        {/* Search */}
        <div className="mb-6 max-w-xl relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-text-muted" />
          </div>
          <Input
            placeholder="Buscar filmes pelo título..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Buscar filmes"
            className="pl-10 h-12 text-lg bg-surface-card border-white/10 focus:border-accent focus:ring-accent/20 transition-all shadow-lg"
          />
        </div>

        {/* Filters — disabled during text search */}
        <div className={`mb-6 flex flex-col gap-3 transition-opacity ${filtersDisabledInSearch ? 'opacity-40 pointer-events-none' : ''}`}>
          {filtersDisabledInSearch && (
            <p className="text-xs text-text-muted italic">Filtros de gênero e nota disponíveis somente no modo de descoberta (sem texto na busca).</p>
          )}

          {/* Rating filter */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-text-muted">
              <Star className="w-3 h-3" /> Nota mínima:
            </span>
            <div className="flex gap-2 flex-wrap">
              {MIN_RATING_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setMinRating(opt.value)}
                  aria-pressed={minRating === opt.value}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all border ${
                    minRating === opt.value
                      ? 'bg-yellow-400/20 border-yellow-400/50 text-yellow-400'
                      : 'border-surface-hover bg-surface-card text-text-secondary hover:border-yellow-400/30 hover:text-yellow-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Genre filter */}
          {genres.length > 0 && (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-text-muted">
                <Film className="w-3 h-3" /> Gênero:
              </span>
              <div className="flex gap-2 flex-wrap">
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => setGenreId(genreId === genre.id ? undefined : genre.id)}
                    aria-pressed={genreId === genre.id}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-all border ${
                      genreId === genre.id
                        ? 'bg-accent text-white shadow-md border-accent'
                        : 'border-surface-hover bg-surface-card text-text-secondary hover:border-accent hover:text-accent'
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-6 flex items-center gap-3 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400 shadow-lg backdrop-blur-md"
              role="status"
            >
              <CheckCircle2 className="h-5 w-5" />
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-text-secondary mt-10 p-8 glass-panel rounded-xl">
            {error}
          </motion.p>
        ) : movies.length === 0 ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-text-secondary mt-10 p-8 glass-panel rounded-xl">
            Nenhum filme encontrado{query ? ` para "${query}"` : ' com esses filtros'}.
          </motion.p>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.05 } }
              }}
              initial="hidden"
              animate="show"
            >
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isAlreadyFavorited={favoritedTmdbIds.has(movie.id)}
                  onCardClick={setDetailMovie}
                  onAddToFavorites={setSelectedMovie}
                />
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className="flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed border border-surface-hover bg-surface-card text-text-secondary hover:border-accent hover:text-accent"
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  // Show pages around current page
                  if (totalPages <= 7) return i + 1;
                  if (page <= 4) return i + 1;
                  if (page >= totalPages - 3) return totalPages - 6 + i;
                  return page - 3 + i;
                }).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    aria-current={page === p ? 'page' : undefined}
                    className={`min-w-[36px] rounded-lg px-3 py-2 text-sm font-medium transition-all border ${
                      page === p
                        ? 'bg-accent border-accent text-white shadow-neon'
                        : 'border-surface-hover bg-surface-card text-text-secondary hover:border-accent hover:text-accent'
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                  className="flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed border border-surface-hover bg-surface-card text-text-secondary hover:border-accent hover:text-accent"
                  aria-label="Proxima pagina"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </motion.main>

      <AnimatePresence>
        {detailMovie && !selectedMovie && (
          <MovieDetailModal
            movie={detailMovie}
            isAlreadyFavorited={favoritedTmdbIds.has(detailMovie.id)}
            onFavorite={handleFavoriteFromDetail}
            onClose={() => setDetailMovie(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedMovie && (
          <AddToFavoritesModal
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
            onSuccess={handleFavoriteAdded}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
