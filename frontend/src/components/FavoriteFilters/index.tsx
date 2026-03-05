import { useEffect, useState } from 'react';
import { useFavoritesStore, selectAllTags, selectAllGenres } from '../../features/favorites/store/useFavoritesStore';
import { Input } from '../ui/Input';
import { Film, Tag as TagIcon } from 'lucide-react';

const DEBOUNCE_DELAY_MS = 400;

const MIN_RATING_OPTIONS = [
  { label: 'Qualquer nota', value: '' },
  { label: '≥ 6.0', value: '6' },
  { label: '≥ 7.0', value: '7' },
  { label: '≥ 7.5', value: '7.5' },
  { label: '≥ 8.0', value: '8' },
  { label: '≥ 9.0', value: '9' },
];

export function FavoriteFilters() {
  const { filters, setFilters } = useFavoritesStore();
  const allTags = useFavoritesStore(selectAllTags);
  const allGenres = useFavoritesStore(selectAllGenres);

  const [actorInput, setActorInput] = useState(filters.actor ?? '');

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setFilters({ actor: actorInput || undefined });
    }, DEBOUNCE_DELAY_MS);

    return () => clearTimeout(debounceTimer);
  }, [actorInput]);

  const handleTagChipClick = (tag: string) => {
    setFilters({ tag: filters.tag === tag ? undefined : tag });
  };

  const handleGenreChipClick = (genre: string) => {
    setFilters({ genre: filters.genre === genre ? undefined : genre });
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, order] = event.target.value.split('-') as ['rating' | 'addedAt', 'asc' | 'desc'];
    setFilters({ sortBy, order });
  };

  const handleMinRatingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setFilters({ minRating: value ? parseFloat(value) : undefined });
  };

  const currentSortValue =
    filters.sortBy && filters.order ? `${filters.sortBy}-${filters.order}` : 'addedAt-desc';

  const currentMinRating = filters.minRating?.toString() ?? '';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <div className="min-w-[180px] flex-1">
          <Input
            placeholder="Filtrar por ator..."
            value={actorInput}
            onChange={(e) => setActorInput(e.target.value)}
            aria-label="Filtrar por ator"
          />
        </div>

        <select
          value={currentMinRating}
          onChange={handleMinRatingChange}
          aria-label="Nota mínima"
          className="rounded border border-surface-hover bg-surface-card px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          {MIN_RATING_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <select
          value={currentSortValue}
          onChange={handleSortChange}
          aria-label="Ordenar favoritos"
          className="rounded border border-surface-hover bg-surface-card px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          <option value="addedAt-desc">Mais recentes primeiro</option>
          <option value="addedAt-asc">Mais antigos primeiro</option>
          <option value="rating-desc">Maior nota primeiro</option>
          <option value="rating-asc">Menor nota primeiro</option>
        </select>
      </div>

      {allGenres.length > 0 && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por gênero">
          <span className="flex items-center gap-1 text-xs text-text-muted self-center">
            <Film className="w-3 h-3" /> Gênero:
          </span>
          {allGenres.map((genre) => (
            <button
              key={genre}
              onClick={() => handleGenreChipClick(genre)}
              aria-pressed={filters.genre === genre}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                filters.genre === genre
                  ? 'bg-accent text-white shadow-md'
                  : 'border border-surface-hover bg-surface-card text-text-secondary hover:border-accent hover:text-accent'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      )}

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por tag">
          <span className="flex items-center gap-1 text-xs text-text-muted self-center">
            <TagIcon className="w-3 h-3" /> Tags:
          </span>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagChipClick(tag)}
              aria-pressed={filters.tag === tag}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                filters.tag === tag
                  ? 'bg-accent text-white shadow-md'
                  : 'border border-surface-hover bg-surface-card text-text-secondary hover:border-accent hover:text-accent'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
