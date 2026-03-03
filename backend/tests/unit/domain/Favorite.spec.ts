import { Favorite } from '../../../src/domain/entities/Favorite';
import { InvalidTmdbIdError } from '../../../src/domain/errors/InvalidTmdbIdError';

describe('Favorite', () => {
  const validParams = {
    id: 'fav-id-1',
    userId: 'user-id-1',
    tmdbId: 550,
    title: 'Fight Club',
    rating: 8.4,
    posterPath: '/path/to/poster.jpg',
    actors: [{ name: 'Brad Pitt', character: 'Tyler Durden' }],
    tags: ['ação clássica'],
  };

  it('should create a Favorite with correct fields', () => {
    const favorite = Favorite.create(validParams);

    expect(favorite.id).toBe('fav-id-1');
    expect(favorite.tmdbId.toNumber()).toBe(550);
    expect(favorite.title).toBe('Fight Club');
    expect(favorite.tags).toEqual(['ação clássica']);
    expect(favorite.addedAt).toBeInstanceOf(Date);
  });

  it('should throw InvalidTmdbIdError when tmdbId is invalid', () => {
    expect(() => Favorite.create({ ...validParams, tmdbId: -1 })).toThrow(InvalidTmdbIdError);
  });

  it('withUpdatedTags should return a new Favorite with the new tags', () => {
    const original = Favorite.create(validParams);
    const updated = original.withUpdatedTags(['novo tag', 'assistir depois']);

    expect(updated.tags).toEqual(['novo tag', 'assistir depois']);
    expect(updated.id).toBe(original.id);
    expect(updated.title).toBe(original.title);
  });

  it('withUpdatedTags should not mutate the original Favorite', () => {
    const original = Favorite.create(validParams);
    original.withUpdatedTags(['novo tag']);

    expect(original.tags).toEqual(['ação clássica']);
  });
});
