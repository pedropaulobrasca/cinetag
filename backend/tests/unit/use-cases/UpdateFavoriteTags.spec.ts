import { UpdateFavoriteTags } from '../../../src/application/use-cases/favorites/UpdateFavoriteTags';
import { AddFavorite } from '../../../src/application/use-cases/favorites/AddFavorite';
import { FavoriteNotFoundError } from '../../../src/domain/errors/FavoriteNotFoundError';
import { UnauthorizedError } from '../../../src/domain/errors/UnauthorizedError';
import { MockFavoriteRepository } from '../../helpers/MockFavoriteRepository';

describe('UpdateFavoriteTags', () => {
  let favoriteRepository: MockFavoriteRepository;
  let updateFavoriteTags: UpdateFavoriteTags;
  let createdFavoriteId: string;

  beforeEach(async () => {
    favoriteRepository = new MockFavoriteRepository();
    updateFavoriteTags = new UpdateFavoriteTags(favoriteRepository);

    const addFavorite = new AddFavorite(favoriteRepository);
    const created = await addFavorite.execute({
      userId: 'user-id-1',
      tmdbId: 550,
      title: 'Fight Club',
      rating: 8.4,
      posterPath: '/poster.jpg',
      actors: [],
      tags: ['original tag'],
    });
    createdFavoriteId = created.id;
  });

  it('should update the tags of a favorite successfully', async () => {
    const output = await updateFavoriteTags.execute({
      favoriteId: createdFavoriteId,
      requestingUserId: 'user-id-1',
      tags: ['novo tag', 'outro tag'],
    });

    expect(output.tags).toEqual(['novo tag', 'outro tag']);
  });

  it('should throw FavoriteNotFoundError when the favorite does not exist', async () => {
    await expect(
      updateFavoriteTags.execute({
        favoriteId: 'non-existent-id',
        requestingUserId: 'user-id-1',
        tags: [],
      }),
    ).rejects.toThrow(FavoriteNotFoundError);
  });

  it('should throw UnauthorizedError when the requesting user is not the owner', async () => {
    await expect(
      updateFavoriteTags.execute({
        favoriteId: createdFavoriteId,
        requestingUserId: 'user-id-2',
        tags: [],
      }),
    ).rejects.toThrow(UnauthorizedError);
  });
});
