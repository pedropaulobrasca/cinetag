import { api } from '../../../lib/api';
import { AddFavoritePayload, Favorite, FavoriteFilters, PaginatedFavoritesResponse } from '../types/favorite.types';

export const favoritesService = {
  async fetchAll(filters: FavoriteFilters = {}): Promise<PaginatedFavoritesResponse> {
    const response = await api.get<PaginatedFavoritesResponse>('/api/favorites', { params: { ...filters, limit: 10 } });
    return response.data;
  },

  async add(payload: AddFavoritePayload): Promise<Favorite> {
    const response = await api.post<Favorite>('/api/favorites', payload);
    return response.data;
  },

  async updateTags(favoriteId: string, tags: string[]): Promise<Favorite> {
    const response = await api.put<Favorite>(`/api/favorites/${favoriteId}/tags`, { tags });
    return response.data;
  },

  async remove(favoriteId: string): Promise<void> {
    await api.delete(`/api/favorites/${favoriteId}`);
  },
};
