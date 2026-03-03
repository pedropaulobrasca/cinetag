import { DomainError } from './DomainError';

export class FavoriteNotFoundError extends DomainError {
  constructor(favoriteId: string) {
    super(`Favorite with id "${favoriteId}" was not found`);
  }
}
