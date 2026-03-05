import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Edit2, Trash2, Tag as TagIcon, Check, Clock, Film } from 'lucide-react';
import { Favorite } from '../../features/favorites/types/favorite.types';
import { useFavoritesStore } from '../../features/favorites/store/useFavoritesStore';
import { TagInput } from '../ui/TagInput';
import { Button } from '../ui/Button';
import { TMDB_IMAGE_BASE_URL } from '../../lib/tmdb';

interface FavoriteCardProps {
  favorite: Favorite;
}

function formatRuntime(minutes: number): string {
  if (!minutes) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

export function FavoriteCard({ favorite }: FavoriteCardProps) {
  const { updateTags, removeFavorite } = useFavoritesStore();

  const [isEditingTags, setIsEditingTags] = useState(false);
  const [editableTags, setEditableTags] = useState(favorite.tags);
  const [isSavingTags, setIsSavingTags] = useState(false);

  const posterUrl = favorite.posterPath
    ? `${TMDB_IMAGE_BASE_URL}${favorite.posterPath}`
    : null;

  const handleSaveTags = async () => {
    setIsSavingTags(true);
    await updateTags(favorite.id, editableTags);
    setIsSavingTags(false);
    setIsEditingTags(false);
  };

  const handleCancelTagEdit = () => {
    setEditableTags(favorite.tags);
    setIsEditingTags(false);
  };

  const releaseYear = favorite.releaseDate?.slice(0, 4);
  const runtime = formatRuntime(favorite.runtime);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="flex gap-4 rounded-xl bg-surface-card p-4 border border-white/5 shadow-glass transition-colors hover:border-accent/30 hover:shadow-neon group"
    >
      <div className="flex-shrink-0 relative overflow-hidden rounded-md">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`Poster de ${favorite.title}`}
            className="h-36 w-24 rounded object-cover"
          />
        ) : (
          <div className="flex h-36 w-24 items-center justify-center rounded bg-surface-secondary text-xs text-text-muted">
            Sem imagem
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 overflow-hidden">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-lg font-bold text-white leading-tight">
            {favorite.title}
          </h3>
          <span className="flex-shrink-0 flex items-center gap-1 text-sm font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full border border-yellow-400/20">
            <Star className="w-3 h-3 fill-yellow-400" />
            {favorite.rating.toFixed(1)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
          {releaseYear ? <span>{releaseYear}</span> : null}
          {runtime ? (
            <>
              <span className="w-1 h-1 bg-surface-hover rounded-full" />
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {runtime}
              </span>
            </>
          ) : null}
          {favorite.genres?.length > 0 ? (
            <>
              <span className="w-1 h-1 bg-surface-hover rounded-full" />
              <span className="flex items-center gap-1">
                <Film className="w-3 h-3" /> {favorite.genres.slice(0, 2).join(', ')}
              </span>
            </>
          ) : null}
        </div>

        {favorite.overview ? (
          <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
            {favorite.overview}
          </p>
        ) : null}

        {favorite.actors.length > 0 ? (
          <p className="text-xs text-text-muted line-clamp-1">
            {favorite.actors.slice(0, 3).map((a) => a.name).join(', ')}
          </p>
        ) : null}

        <div className="mt-1">
          {isEditingTags ? (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex flex-col gap-3 p-3 bg-surface-secondary/50 rounded-lg border border-white/5">
              <TagInput tags={editableTags} onChange={setEditableTags} />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveTags} isLoading={isSavingTags} className="flex-1 flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" /> Salvar
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancelTagEdit} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {favorite.tags.length > 0 ? (
                favorite.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-accent/20 border border-accent/20 px-2.5 py-0.5 text-xs font-medium text-accent shadow-sm"
                  >
                    <TagIcon className="w-3 h-3" />
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-xs text-text-muted italic flex items-center gap-1">
                  <TagIcon className="w-3 h-3" /> Nenhum marcador
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-auto flex gap-2 pt-2 justify-end opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
          {!isEditingTags ? (
            <Button size="sm" variant="secondary" onClick={() => setIsEditingTags(true)} className="flex items-center gap-1.5">
              <Edit2 className="w-4 h-4" /> Editar tags
            </Button>
          ) : null}
          <Button
            size="sm"
            variant="danger"
            onClick={() => removeFavorite(favorite.id)}
            aria-label={`Remover ${favorite.title} dos favoritos`}
            className="flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" /> Remover
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
