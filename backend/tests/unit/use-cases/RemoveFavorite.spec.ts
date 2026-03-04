import { RemoveFavorite } from '../../../src/application/use-cases/favorites/RemoveFavorite';
import { AddFavorite } from '../../../src/application/use-cases/favorites/AddFavorite';
import { FavoriteNotFoundError } from '../../../src/domain/errors/FavoriteNotFoundError';
import { UnauthorizedError } from '../../../src/domain/errors/UnauthorizedError';
import { MockFavoriteRepository } from '../../helpers/MockFavoriteRepository';

describe('RemoveFavorite', () => {
  let favoriteRepository: MockFavoriteRepository;
  let removeFavorite: RemoveFavorite;
  let createdFavoriteId: string;

  beforeEach(async () => {
    favoriteRepository = new MockFavoriteRepository();
    removeFavorite = new RemoveFavorite(favoriteRepository);

    const addFavorite = new AddFavorite(favoriteRepository);
    const created = await addFavorite.execute({
      userId: 'user-id-1',
      tmdbId: 550,
      title: 'Fight Club',
      rating: 8.4,
      posterPath: '/poster.jpg',
      actors: [],
      tags: [],
    });
    createdFavoriteId = created.id;
  });

  it('should remove a favorite successfully', async () => {
    await removeFavorite.execute({
      favoriteId: createdFavoriteId,
      requestingUserId: 'user-id-1',
    });

    const remaining = await favoriteRepository.findById(createdFavoriteId);
    expect(remaining).toBeNull();
  });

  it('should throw FavoriteNotFoundError when the favorite does not exist', async () => {
    await expect(
      removeFavorite.execute({
        favoriteId: 'non-existent-id',
        requestingUserId: 'user-id-1',
      }),
    ).rejects.toThrow(FavoriteNotFoundError);
  });

  it('should throw UnauthorizedError when the requesting user is not the owner', async () => {
    await expect(
      removeFavorite.execute({
        favoriteId: createdFavoriteId,
        requestingUserId: 'user-id-2',
      }),
    ).rejects.toThrow(UnauthorizedError);
  });
});
