import { DomainError } from './DomainError';

export class UnauthorizedError extends DomainError {
  constructor() {
    super('You are not authorized to perform this action');
  }
}
