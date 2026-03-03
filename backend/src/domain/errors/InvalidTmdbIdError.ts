import { DomainError } from './DomainError';

export class InvalidTmdbIdError extends DomainError {
  constructor(value: unknown) {
    super(`"${value}" is not a valid TMDB id — must be a positive integer`);
  }
}
