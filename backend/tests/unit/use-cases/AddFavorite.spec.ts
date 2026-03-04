import { AddFavorite } from '../../../src/application/use-cases/favorites/AddFavorite';
import { FavoriteAlreadyExistsError } from '../../../src/domain/errors/FavoriteAlreadyExistsError';
import { MockFavoriteRepository } from '../../helpers/MockFavoriteRepository';

describe('AddFavorite', () => {
  let favoriteRepository: MockFavoriteRepository;
  let addFavorite: AddFavorite;

  const validInput = {
    userId: 'user-id-1',
    tmdbId: 550,
    title: 'Fight Club',
    rating: 8.4,
    posterPath: '/poster.jpg',
    actors: [{ name: 'Brad Pitt', character: 'Tyler Durden' }],
    tags: ['ação clássica'],
  };

  beforeEach(() => {
    favoriteRepository = new MockFavoriteRepository();
    addFavorite = new AddFavorite(favoriteRepository);
  });

  it('should save a movie as favorite and return the created data', async () => {
    const output = await addFavorite.execute(validInput);

    expect(output.tmdbId).toBe(550);
    expect(output.title).toBe('Fight Club');
    expect(output.tags).toEqual(['ação clássica']);
    expect(output.id).toBeDefined();
  });

  it('should throw FavoriteAlreadyExistsError when the same movie is favorited twice', async () => {
    await addFavorite.execute(validInput);

    await expect(addFavorite.execute(validInput)).rejects.toThrow(FavoriteAlreadyExistsError);
  });
});
