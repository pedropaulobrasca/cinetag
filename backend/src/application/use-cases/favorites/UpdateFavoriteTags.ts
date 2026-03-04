import { FavoriteNotFoundError } from '../../../domain/errors/FavoriteNotFoundError';
import { UnauthorizedError } from '../../../domain/errors/UnauthorizedError';
import { IFavoriteRepository } from '../../../domain/repositories/IFavoriteRepository';
import { UpdateFavoriteTagsInput, FavoriteOutput } from '../../dtos/FavoriteDtos';

export class UpdateFavoriteTags {
  constructor(private readonly favoriteRepository: IFavoriteRepository) {}

  async execute(input: UpdateFavoriteTagsInput): Promise<FavoriteOutput> {
    const favorite = await this.favoriteRepository.findById(input.favoriteId);

    if (!favorite) {
      throw new FavoriteNotFoundError(input.favoriteId);
    }

    if (favorite.userId !== input.requestingUserId) {
      throw new UnauthorizedError();
    }

    const updatedFavorite = favorite.withUpdatedTags(input.tags);

    await this.favoriteRepository.update(updatedFavorite);

    return {
      id: updatedFavorite.id,
      userId: updatedFavorite.userId,
      tmdbId: updatedFavorite.tmdbId.toNumber(),
      title: updatedFavorite.title,
      rating: updatedFavorite.rating,
      posterPath: updatedFavorite.posterPath,
      actors: updatedFavorite.actors,
      tags: updatedFavorite.tags,
      addedAt: updatedFavorite.addedAt,
    };
  }
}
