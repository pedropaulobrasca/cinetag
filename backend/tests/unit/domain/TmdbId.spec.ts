import { TmdbId } from '../../../src/domain/value-objects/TmdbId';
import { InvalidTmdbIdError } from '../../../src/domain/errors/InvalidTmdbIdError';

describe('TmdbId', () => {
  it('should create a valid TmdbId from a positive integer', () => {
    const id = new TmdbId(550);
    expect(id.toNumber()).toBe(550);
  });

  it('should accept a numeric string that represents a positive integer', () => {
    const id = new TmdbId('1234');
    expect(id.toNumber()).toBe(1234);
  });

  it('should throw InvalidTmdbIdError for zero', () => {
    expect(() => new TmdbId(0)).toThrow(InvalidTmdbIdError);
  });

  it('should throw InvalidTmdbIdError for negative numbers', () => {
    expect(() => new TmdbId(-1)).toThrow(InvalidTmdbIdError);
  });

  it('should throw InvalidTmdbIdError for a float', () => {
    expect(() => new TmdbId(1.5)).toThrow(InvalidTmdbIdError);
  });

  it('should throw InvalidTmdbIdError for non-numeric strings', () => {
    expect(() => new TmdbId('abc')).toThrow(InvalidTmdbIdError);
  });

  it('should return true when comparing two TmdbIds with the same value', () => {
    const first = new TmdbId(550);
    const second = new TmdbId(550);
    expect(first.equals(second)).toBe(true);
  });

  it('should return false when comparing two different TmdbIds', () => {
    const first = new TmdbId(550);
    const second = new TmdbId(551);
    expect(first.equals(second)).toBe(false);
  });
});
