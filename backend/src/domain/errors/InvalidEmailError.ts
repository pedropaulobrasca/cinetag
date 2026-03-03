import { DomainError } from './DomainError';

export class InvalidEmailError extends DomainError {
  constructor(email: string) {
    super(`"${email}" is not a valid email address`);
  }
}
