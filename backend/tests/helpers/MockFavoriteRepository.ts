import { Favorite } from '../../src/domain/entities/Favorite';
import {
  FavoriteFilters,
  IFavoriteRepository,
  PaginatedFavorites,
} from '../../src/domain/repositories/IFavoriteRepository';

export class MockFavoriteRepository implements IFavoriteRepository {
  private store = new Map<string, Favorite>();

  async findAllByUserId(userId: string, filters: FavoriteFilters): Promise<PaginatedFavorites> {
    let results = [...this.store.values()].filter((f) => f.userId === userId);

    if (filters.tag) {
      results = results.filter((f) => f.tags.includes(filters.tag!));
    }

    if (filters.actor) {
      const actorQuery = filters.actor.toLowerCase();
      results = results.filter((f) =>
        f.actors.some((a) => a.name.toLowerCase().includes(actorQuery)),
      );
    }

    if (filters.genre) {
      results = results.filter((f) => f.genres.includes(filters.genre!));
    }

    if (filters.minRating !== undefined) {
      results = results.filter((f) => f.rating >= filters.minRating!);
    }

    if (filters.sortBy === 'rating') {
      results.sort((a, b) =>
        filters.order === 'asc' ? a.rating - b.rating : b.rating - a.rating,
      );
    }

    const total = results.length;
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const totalPages = Math.ceil(total / limit);
    const data = results.slice((page - 1) * limit, page * limit);

    return { data, total, page, totalPages };
  }

  async findById(id: string): Promise<Favorite | null> {
    return this.store.get(id) ?? null;
  }

  async existsByUserIdAndTmdbId(userId: string, tmdbId: number): Promise<boolean> {
    for (const favorite of this.store.values()) {
      if (favorite.userId === userId && favorite.tmdbId.toNumber() === tmdbId) {
        return true;
      }
    }
    return false;
  }

  async save(favorite: Favorite): Promise<void> {
    this.store.set(favorite.id, favorite);
  }

  async update(favorite: Favorite): Promise<void> {
    this.store.set(favorite.id, favorite);
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }

  clear(): void {
    this.store.clear();
  }
}
