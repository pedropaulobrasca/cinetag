import { useEffect } from 'react';
import { useFavoritesStore } from '../store/useFavoritesStore';

export function useFavorites() {
  const store = useFavoritesStore();

  useEffect(() => {
    store.fetchFavorites();
  }, [store.filters]);

  return store;
}
