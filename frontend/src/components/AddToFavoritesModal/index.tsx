import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Star, Heart } from 'lucide-react';
import { TmdbMovie } from '../../features/movies/types/movie.types';
import { movieService } from '../../features/movies/services/movieService';
import { useFavoritesStore } from '../../features/favorites/store/useFavoritesStore';
import { TagInput } from '../ui/TagInput';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { TMDB_IMAGE_BASE_URL } from '../../lib/tmdb';

interface AddToFavoritesModalProps {
  movie: TmdbMovie;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddToFavoritesModal({ movie, onClose, onSuccess }: AddToFavoritesModalProps) {
  const { addFavorite } = useFavoritesStore();

  const [tags, setTags] = useState<string[]>([]);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setIsFetchingDetails(true);
    setError(null);

    try {
      const [credits, details] = await Promise.all([
        movieService.fetchCredits(movie.id),
        movieService.fetchMovieDetails(movie.id),
      ]);

      setIsFetchingDetails(false);

      const topActors = credits.cast.slice(0, 10).map((castMember) => ({
        name: castMember.name,
        character: castMember.character,
      }));

      await addFavorite({
        tmdbId: movie.id,
        title: movie.title,
        rating: movie.vote_average,
        posterPath: movie.poster_path ?? '',
        overview: movie.overview,
        releaseDate: movie.release_date ?? '',
        genres: details.genres.map((g) => g.name),
        runtime: details.runtime ?? 0,
        actors: topActors,
        tags,
      });

      onSuccess();
      onClose();
    } catch {
      setError('Não foi possível adicionar o filme aos favoritos. Tente novamente.');
      setIsFetchingDetails(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-md rounded-2xl bg-surface-secondary border border-white/10 shadow-2xl overflow-hidden glass-panel"
      >
        <div className="flex gap-4 p-5 bg-surface-primary/50 border-b border-white/5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors bg-surface-card p-1.5 rounded-full"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>

          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`Poster de ${movie.title}`}
              className="h-28 w-20 flex-shrink-0 rounded-md object-cover shadow-lg"
            />
          ) : null}

          <div className="pr-8 flex flex-col justify-center">
            <h2 id="modal-title" className="text-xl font-bold text-white leading-tight mb-2">
              {movie.title}
            </h2>
            <p className="flex items-center gap-2 text-sm text-text-muted font-medium">
              <span>{movie.release_date?.slice(0, 4)}</span>
              <span className="w-1 h-1 bg-surface-hover rounded-full" />
              <span className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded text-xs border border-yellow-400/20">
                <Star className="w-3 h-3 fill-yellow-400" /> {movie.vote_average.toFixed(1)}
              </span>
            </p>
            {movie.overview ? (
              <p className="mt-2 text-xs text-text-muted line-clamp-3 leading-relaxed">
                {movie.overview}
              </p>
            ) : null}
          </div>
        </div>

        <div className="p-5">
          <label className="mb-2 block text-sm font-medium text-text-secondary">
            Tags personalizadas
          </label>
          <TagInput
            tags={tags}
            onChange={setTags}
            placeholder="Ex: ação clássica, assistir depois"
          />
          <p className="mt-1 text-xs text-text-muted">
            Pressione Enter ou vírgula para adicionar uma tag
          </p>

          {error ? (
            <p role="alert" className="mt-3 rounded bg-red-900/30 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          ) : null}

          {isFetchingDetails ? (
            <div className="mt-3 flex items-center gap-2 text-sm text-text-secondary">
              <Spinner size="sm" />
              Buscando detalhes do filme...
            </div>
          ) : null}
        </div>

        <div className="flex justify-end gap-3 border-t border-white/5 bg-surface-primary/30 px-5 py-4 mt-2">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} isLoading={isSubmitting} disabled={isSubmitting} className="flex items-center gap-2 shadow-neon">
            {!isSubmitting && <Heart className="w-4 h-4" />} Salvar favorito
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
