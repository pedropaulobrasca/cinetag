import { randomUUID } from 'crypto';
import { Favorite } from '../../../domain/entities/Favorite';
import { FavoriteAlreadyExistsError } from '../../../domain/errors/FavoriteAlreadyExistsError';
import { IFavoriteRepository } from '../../../domain/repositories/IFavoriteRepository';
import { AddFavoriteInput, FavoriteOutput } from '../../dtos/FavoriteDtos';

export class AddFavorite {
  constructor(private readonly favoriteRepository: IFavoriteRepository) {}

  async execute(input: AddFavoriteInput): Promise<FavoriteOutput> {
    const alreadyFavorited = await this.favoriteRepository.existsByUserIdAndTmdbId(
      input.userId,
      input.tmdbId,
    );

    if (alreadyFavorited) {
      throw new FavoriteAlreadyExistsError(input.tmdbId);
    }

    const favorite = Favorite.create({
      id: randomUUID(),
      userId: input.userId,
      tmdbId: input.tmdbId,
      title: input.title,
      rating: input.rating,
      posterPath: input.posterPath,
      overview: input.overview,
      releaseDate: input.releaseDate,
      genres: input.genres,
      runtime: input.runtime,
      actors: input.actors,
      tags: input.tags,
    });

    await this.favoriteRepository.save(favorite);

    return {
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
    };
  }
}
