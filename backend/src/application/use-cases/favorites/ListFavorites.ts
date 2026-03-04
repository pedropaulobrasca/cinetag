import { IFavoriteRepository } from '../../../domain/repositories/IFavoriteRepository';
import { ListFavoritesInput, PaginatedFavoritesOutput } from '../../dtos/FavoriteDtos';

export class ListFavorites {
  constructor(private readonly favoriteRepository: IFavoriteRepository) {}

  async execute(input: ListFavoritesInput): Promise<PaginatedFavoritesOutput> {
    const result = await this.favoriteRepository.findAllByUserId(input.userId, {
      tag: input.tag,
      actor: input.actor,
      genre: input.genre,
      minRating: input.minRating,
      sortBy: input.sortBy,
      order: input.order,
      page: input.page,
      limit: input.limit,
    });

    return {
      data: result.data.map((favorite) => ({
        id: favorite.id,
        userId: favorite.userId,
        tmdbId: favorite.tmdbId.toNumber(),
        title: favorite.title,
        rating: favorite.rating,
        posterPath: favorite.posterPath,
        overview: favorite.overview,
        releaseDate: favorite.releaseDate,
        genres: favorite.genres,
        runtime: favorite.runtime,
        actors: favorite.actors,
        tags: favorite.tags,
        addedAt: favorite.addedAt,
      })),
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    };
  }
}
