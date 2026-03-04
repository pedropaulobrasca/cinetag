import { Router } from 'express';
import { FavoriteController } from '../controllers/FavoriteController';
import { validateRequest } from '../middlewares/validateRequest';
import {
  addFavoriteSchema,
  updateFavoriteTagsSchema,
  listFavoritesQuerySchema,
} from '../schemas/favoriteSchemas';

export function buildFavoriteRoutes(favoriteController: FavoriteController): Router {
  const router = Router();

  router.get(
    '/',
    validateRequest(listFavoritesQuerySchema, 'query'),
    favoriteController.list,
  );

  router.post('/', validateRequest(addFavoriteSchema), favoriteController.add);

  router.put(
    '/:id/tags',
    validateRequest(updateFavoriteTagsSchema),
    favoriteController.updateTags,
  );

  router.delete('/:id', favoriteController.remove);

  return router;
}
