import { FilterQuery } from 'mongoose';
import { Favorite } from '../../../domain/entities/Favorite';
import {
  FavoriteFilters,
  IFavoriteRepository,
  PaginatedFavorites,
} from '../../../domain/repositories/IFavoriteRepository';
import { FavoriteModel, IFavoriteDocument } from '../models/FavoriteModel';

export class MongoFavoriteRepository implements IFavoriteRepository {
  async findAllByUserId(userId: string, filters: FavoriteFilters): Promise<PaginatedFavorites> {
    const query: FilterQuery<IFavoriteDocument> = { userId };

    if (filters.tag) {
      query.tags = { $in: [filters.tag] };
    }

    if (filters.actor) {
      query['actors.name'] = { $regex: filters.actor, $options: 'i' };
    }

    if (filters.genre) {
      query.genres = { $in: [filters.genre] };
    }

    if (filters.minRating !== undefined) {
      query.rating = { $gte: filters.minRating };
    }

    const sortField = filters.sortBy === 'rating' ? 'rating' : 'addedAt';
    const sortOrder = filters.order === 'asc' ? 1 : -1;

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const skip = (page - 1) * limit;

    const [documents, total] = await Promise.all([
      FavoriteModel.find(query)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      FavoriteModel.countDocuments(query),
    ]);

    return {
      data: documents.map(this.toDomain),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<Favorite | null> {
    const document = await FavoriteModel.findById(id).lean().exec();
    if (!document) return null;
    return this.toDomain(document);
  }

  async existsByUserIdAndTmdbId(userId: string, tmdbId: number): Promise<boolean> {
    const count = await FavoriteModel.countDocuments({ userId, tmdbId });
    return count > 0;
  }

  async save(favorite: Favorite): Promise<void> {
    await FavoriteModel.create(this.toPersistence(favorite));
  }

  async update(favorite: Favorite): Promise<void> {
    await FavoriteModel.findByIdAndUpdate(favorite.id, this.toPersistence(favorite));
  }

  async delete(id: string): Promise<void> {
    await FavoriteModel.findByIdAndDelete(id);
  }

  private toDomain(document: IFavoriteDocument): Favorite {
    return Favorite.restore(
      document._id as string,
      document.userId,
      document.tmdbId,
      document.title,
      document.rating,
      document.posterPath,
      document.overview ?? '',
      document.releaseDate ?? '',
      document.genres ?? [],
      document.runtime ?? 0,
      document.actors,
      document.tags,
      document.addedAt,
    );
  }

  private toPersistence(favorite: Favorite) {
    return {
      _id: favorite.id,
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
