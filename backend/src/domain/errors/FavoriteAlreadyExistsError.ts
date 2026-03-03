import { DomainError } from './DomainError';

export class FavoriteAlreadyExistsError extends DomainError {
  constructor(tmdbId: number) {
    super(`Movie with TMDB id "${tmdbId}" is already in your favorites`);
  }
}
