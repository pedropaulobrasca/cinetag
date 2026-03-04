import { Request, Response, NextFunction } from 'express';
import { AddFavorite } from '../../application/use-cases/favorites/AddFavorite';
import { ListFavorites } from '../../application/use-cases/favorites/ListFavorites';
import { UpdateFavoriteTags } from '../../application/use-cases/favorites/UpdateFavoriteTags';
import { RemoveFavorite } from '../../application/use-cases/favorites/RemoveFavorite';

export class FavoriteController {
  constructor(
    private readonly addFavorite: AddFavorite,
    private readonly listFavorites: ListFavorites,
    private readonly updateFavoriteTags: UpdateFavoriteTags,
    private readonly removeFavorite: RemoveFavorite,
  ) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tag, actor, genre, minRating, sortBy, order, page, limit } = req.query as {
        tag?: string;
        actor?: string;
        genre?: string;
        minRating?: number;
        sortBy?: 'rating' | 'addedAt';
        order?: 'asc' | 'desc';
        page?: number;
        limit?: number;
      };

      const result = await this.listFavorites.execute({
        userId: req.userId,
        tag,
        actor,
        genre,
        minRating,
        sortBy,
        order,
        page,
        limit,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  add = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const favorite = await this.addFavorite.execute({
        userId: req.userId,
        ...req.body,
      });

      res.status(201).json(favorite);
    } catch (error) {
      next(error);
    }
  };

  updateTags = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const favorite = await this.updateFavoriteTags.execute({
        favoriteId: req.params.id,
        requestingUserId: req.userId,
        tags: req.body.tags,
      });

      res.status(200).json(favorite);
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.removeFavorite.execute({
        favoriteId: req.params.id,
        requestingUserId: req.userId,
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
