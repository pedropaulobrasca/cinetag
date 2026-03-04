import { ListFavorites } from '../../../src/application/use-cases/favorites/ListFavorites';
import { AddFavorite } from '../../../src/application/use-cases/favorites/AddFavorite';
import { MockFavoriteRepository } from '../../helpers/MockFavoriteRepository';

describe('ListFavorites', () => {
  let favoriteRepository: MockFavoriteRepository;
  let listFavorites: ListFavorites;
  let addFavorite: AddFavorite;

  beforeEach(async () => {
    favoriteRepository = new MockFavoriteRepository();
    listFavorites = new ListFavorites(favoriteRepository);
    addFavorite = new AddFavorite(favoriteRepository);

    await addFavorite.execute({
      userId: 'user-id-1',
      tmdbId: 550,
      title: 'Fight Club',
      rating: 8.4,
      posterPath: '/poster1.jpg',
      actors: [{ name: 'Brad Pitt', character: 'Tyler Durden' }],
      tags: ['ação clássica'],
    });

    await addFavorite.execute({
      userId: 'user-id-1',
      tmdbId: 278,
      title: 'The Shawshank Redemption',
      rating: 9.3,
      posterPath: '/poster2.jpg',
      actors: [{ name: 'Morgan Freeman', character: 'Red' }],
      tags: ['dramão'],
    });
  });

  it('should return all favorites for a user', async () => {
    const favorites = await listFavorites.execute({ userId: 'user-id-1' });
    expect(favorites).toHaveLength(2);
  });

  it('should return an empty list for a user with no favorites', async () => {
    const favorites = await listFavorites.execute({ userId: 'user-id-2' });
    expect(favorites).toHaveLength(0);
  });

  it('should filter by tag', async () => {
    const favorites = await listFavorites.execute({ userId: 'user-id-1', tag: 'dramão' });
    expect(favorites).toHaveLength(1);
    expect(favorites[0].title).toBe('The Shawshank Redemption');
  });

  it('should filter by actor name (case-insensitive)', async () => {
    const favorites = await listFavorites.execute({
      userId: 'user-id-1',
      actor: 'morgan',
    });
    expect(favorites).toHaveLength(1);
    expect(favorites[0].title).toBe('The Shawshank Redemption');
  });

  it('should sort by rating in descending order', async () => {
    const favorites = await listFavorites.execute({
      userId: 'user-id-1',
      sortBy: 'rating',
      order: 'desc',
    });
    expect(favorites[0].rating).toBeGreaterThan(favorites[1].rating);
  });

  it('should sort by rating in ascending order', async () => {
    const favorites = await listFavorites.execute({
      userId: 'user-id-1',
      sortBy: 'rating',
      order: 'asc',
    });
    expect(favorites[0].rating).toBeLessThan(favorites[1].rating);
  });
});
