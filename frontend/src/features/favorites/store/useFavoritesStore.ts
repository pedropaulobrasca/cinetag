import { create } from 'zustand';
import { favoritesService } from '../services/favoritesService';
import { AddFavoritePayload, Favorite, FavoriteFilters } from '../types/favorite.types';

interface FavoritesState {
  favorites: Favorite[];
  total: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  filters: FavoriteFilters;
  setFilters: (partialFilters: Partial<FavoriteFilters>) => void;
  fetchFavorites: () => Promise<void>;
  addFavorite: (payload: AddFavoritePayload) => Promise<void>;
  updateTags: (favoriteId: string, tags: string[]) => Promise<void>;
  removeFavorite: (favoriteId: string) => Promise<void>;
  clearError: () => void;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  total: 0,
  totalPages: 1,
  isLoading: false,
  error: null,
  filters: { page: 1 },

  setFilters: (partialFilters) => {
    // Reset to page 1 when any filter other than page changes
    const resetPage = Object.keys(partialFilters).some((k) => k !== 'page');
    set((state) => ({
      filters: {
        ...state.filters,
        ...partialFilters,
        ...(resetPage && partialFilters.page === undefined ? { page: 1 } : {}),
      },
    }));
  },

  fetchFavorites: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await favoritesService.fetchAll(get().filters);
      set({ favorites: result.data, total: result.total, totalPages: result.totalPages, isLoading: false });
    } catch {
      set({ error: 'Não foi possível carregar seus favoritos.', isLoading: false });
    }
  },

  addFavorite: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const newFavorite = await favoritesService.add(payload);
      set((state) => ({
        favorites: [newFavorite, ...state.favorites],
        total: state.total + 1,
        isLoading: false,
      }));
    } catch {
      set({ error: 'Não foi possível adicionar o filme aos favoritos.', isLoading: false });
      throw new Error('Failed to add favorite');
    }
  },

  updateTags: async (favoriteId, tags) => {
    try {
      const updatedFavorite = await favoritesService.updateTags(favoriteId, tags);
      set((state) => ({
        favorites: state.favorites.map((f) => (f.id === favoriteId ? updatedFavorite : f)),
      }));
    } catch {
      set({ error: 'Não foi possível atualizar as tags.' });
    }
  },

  removeFavorite: async (favoriteId) => {
    try {
      await favoritesService.remove(favoriteId);
      set((state) => ({
        favorites: state.favorites.filter((f) => f.id !== favoriteId),
        total: state.total - 1,
      }));
    } catch {
      set({ error: 'Não foi possível remover o favorito.' });
    }
  },

  clearError: () => set({ error: null }),
}));

export const selectAllTags = (state: { favorites: Favorite[] }): string[] => {
  const tagSet = new Set<string>();
  state.favorites.forEach((f) => f.tags?.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
};

export const selectAllGenres = (state: { favorites: Favorite[] }): string[] => {
  const genreSet = new Set<string>();
  state.favorites.forEach((f) => f.genres?.forEach((g) => genreSet.add(g)));
  return Array.from(genreSet).sort();
};
