import { FavoriteNotFoundError } from '../../../domain/errors/FavoriteNotFoundError';
import { UnauthorizedError } from '../../../domain/errors/UnauthorizedError';
import { IFavoriteRepository } from '../../../domain/repositories/IFavoriteRepository';
import { RemoveFavoriteInput } from '../../dtos/FavoriteDtos';

export class RemoveFavorite {
  constructor(private readonly favoriteRepository: IFavoriteRepository) {}

  async execute(input: RemoveFavoriteInput): Promise<void> {
    const favorite = await this.favoriteRepository.findById(input.favoriteId);

    if (!favorite) {
      throw new FavoriteNotFoundError(input.favoriteId);
    }

    if (favorite.userId !== input.requestingUserId) {
      throw new UnauthorizedError();
    }

    await this.favoriteRepository.delete(input.favoriteId);
  }
}
