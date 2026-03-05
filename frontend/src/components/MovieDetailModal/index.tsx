import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Star, Clock, Film, Heart, Users, Check } from 'lucide-react';
import { TmdbMovie, TmdbMovieDetails, TmdbMovieCredits } from '../../features/movies/types/movie.types';
import { movieService } from '../../features/movies/services/movieService';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { TMDB_IMAGE_BASE_URL } from '../../lib/tmdb';

interface MovieDetailModalProps {
  movie: TmdbMovie;
  isAlreadyFavorited: boolean;
  onFavorite: () => void;
  onClose: () => void;
}

function formatRuntime(minutes: number): string {
  if (!minutes) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

export function MovieDetailModal({ movie, isAlreadyFavorited, onFavorite, onClose }: MovieDetailModalProps) {
  const [details, setDetails] = useState<TmdbMovieDetails | null>(null);
  const [credits, setCredits] = useState<TmdbMovieCredits | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const posterUrl = movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : null;

  useEffect(() => {
    Promise.all([
      movieService.fetchMovieDetails(movie.id),
      movieService.fetchCredits(movie.id),
    ])
      .then(([det, cred]) => {
        setDetails(det);
        setCredits(cred);
      })
      .finally(() => setIsLoading(false));
  }, [movie.id]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-lg rounded-2xl bg-surface-secondary border border-white/10 shadow-2xl overflow-hidden glass-panel max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-4 p-5 bg-surface-primary/50 border-b border-white/5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors bg-surface-card p-1.5 rounded-full z-10"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>

          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`Poster de ${movie.title}`}
              className="h-36 w-24 flex-shrink-0 rounded-md object-cover shadow-lg"
            />
          ) : (
            <div className="flex h-36 w-24 flex-shrink-0 items-center justify-center rounded-md bg-surface-card text-xs text-text-muted">
              Sem imagem
            </div>
          )}

          <div className="pr-8 flex flex-col justify-center gap-2 overflow-hidden">
            <h2 id="detail-modal-title" className="text-xl font-bold text-white leading-tight">
              {movie.title}
            </h2>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              {movie.release_date ? (
                <span className="text-text-muted">{movie.release_date.slice(0, 4)}</span>
              ) : null}
              <span className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded border border-yellow-400/20 font-semibold">
                <Star className="w-3 h-3 fill-yellow-400" /> {movie.vote_average.toFixed(1)}
              </span>
              {details?.runtime ? (
                <span className="flex items-center gap-1 text-text-muted">
                  <Clock className="w-3 h-3" /> {formatRuntime(details.runtime)}
                </span>
              ) : null}
            </div>

            {details?.genres?.length ? (
              <div className="flex flex-wrap gap-1">
                {details.genres.slice(0, 3).map((g) => (
                  <span
                    key={g.id}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs"
                  >
                    <Film className="w-2.5 h-2.5" /> {g.name}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-5 flex flex-col gap-5">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              {movie.overview ? (
                <div>
                  <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Sinopse
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{movie.overview}</p>
                </div>
              ) : null}

              {credits?.cast?.length ? (
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" /> Elenco principal
                  </h3>
                  <div className="flex flex-col gap-2">
                    {credits.cast.slice(0, 6).map((actor) => (
                      <div key={`${actor.name}-${actor.character}`} className="flex items-center justify-between gap-4 text-sm">
                        <span className="font-medium text-text-primary truncate">{actor.name}</span>
                        <span className="flex-shrink-0 text-xs italic text-text-muted">{actor.character}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-white/5 bg-surface-primary/30 px-5 py-4">
          <Button variant="ghost" onClick={onClose}>
            Fechar
          </Button>
          {isAlreadyFavorited ? (
            <Button variant="ghost" disabled className="opacity-60 flex items-center gap-2">
              <Check className="w-4 h-4" /> Já favoritado
            </Button>
          ) : (
            <Button onClick={onFavorite} className="flex items-center gap-2 shadow-neon">
              <Heart className="w-4 h-4" /> Favoritar
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
