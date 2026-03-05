import { motion } from 'framer-motion';
import { Star, Plus, Check } from 'lucide-react';
import { TmdbMovie } from '../../features/movies/types/movie.types';
import { TMDB_IMAGE_BASE_URL } from '../../lib/tmdb';
import { Button } from '../ui/Button';

interface MovieCardProps {
  movie: TmdbMovie;
  isAlreadyFavorited: boolean;
  onCardClick: (movie: TmdbMovie) => void;
  onAddToFavorites: (movie: TmdbMovie) => void;
}

export function MovieCard({ movie, isAlreadyFavorited, onCardClick, onAddToFavorites }: MovieCardProps) {
  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : null;

  const releaseYear = movie.release_date?.slice(0, 4) ?? 'N/A';

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative flex flex-col overflow-hidden rounded-xl bg-surface-card border border-white/5 transition-colors hover:border-accent/30 shadow-glass hover:shadow-neon"
    >
      <button
        className="relative aspect-[2/3] overflow-hidden bg-surface-secondary w-full text-left cursor-pointer"
        onClick={() => onCardClick(movie)}
        aria-label={`Ver detalhes de ${movie.title}`}
      >
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`Poster de ${movie.title}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-muted">
            Sem imagem
          </div>
        )}

        <div className="absolute right-2 top-2 rounded-full bg-black/60 backdrop-blur-md px-2 py-1 text-xs font-bold text-yellow-400 flex items-center gap-1 shadow-lg border border-white/10">
          <Star className="w-3 h-3 fill-yellow-400" />
          {movie.vote_average.toFixed(1)}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-surface-primary/90 via-surface-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <button
          className="text-left"
          onClick={() => onCardClick(movie)}
          aria-label={`Ver detalhes de ${movie.title}`}
        >
          <h3 className="line-clamp-2 text-sm font-semibold text-text-primary leading-tight hover:text-accent transition-colors">
            {movie.title}
          </h3>
          <span className="text-xs text-text-muted">{releaseYear}</span>
        </button>

        <div className="mt-auto pt-3">
          <Button
            variant={isAlreadyFavorited ? 'ghost' : 'primary'}
            size="sm"
            disabled={isAlreadyFavorited}
            onClick={() => onAddToFavorites(movie)}
            className={`w-full flex items-center justify-center gap-2 font-medium ${isAlreadyFavorited ? 'opacity-80' : 'shadow-lg hover:shadow-accent/40 rounded-lg'}`}
            aria-label={isAlreadyFavorited ? 'Já favoritado' : `Favoritar ${movie.title}`}
          >
            {isAlreadyFavorited ? (
              <><Check className="w-4 h-4" /> Favoritado</>
            ) : (
              <><Plus className="w-4 h-4" /> Favoritar</>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
