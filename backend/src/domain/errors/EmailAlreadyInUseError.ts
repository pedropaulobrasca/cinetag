import { DomainError } from './DomainError';

export class EmailAlreadyInUseError extends DomainError {
  constructor(email: string) {
    super(`The email "${email}" is already in use`);
  }
}
