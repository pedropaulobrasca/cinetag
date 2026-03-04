import { Request, Response, NextFunction } from 'express';
import { DomainError } from '../../domain/errors/DomainError';
import { EmailAlreadyInUseError } from '../../domain/errors/EmailAlreadyInUseError';
import { InvalidCredentialsError } from '../../domain/errors/InvalidCredentialsError';
import { FavoriteNotFoundError } from '../../domain/errors/FavoriteNotFoundError';
import { FavoriteAlreadyExistsError } from '../../domain/errors/FavoriteAlreadyExistsError';
import { UnauthorizedError } from '../../domain/errors/UnauthorizedError';

function resolveHttpStatusForDomainError(error: DomainError): number {
  if (error instanceof EmailAlreadyInUseError) return 409;
  if (error instanceof InvalidCredentialsError) return 401;
  if (error instanceof FavoriteNotFoundError) return 404;
  if (error instanceof FavoriteAlreadyExistsError) return 409;
  if (error instanceof UnauthorizedError) return 403;
  return 400;
}

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof DomainError) {
    res.status(resolveHttpStatusForDomainError(error)).json({
      error: error.message,
    });
    return;
  }

  console.error('[Unhandled error]', error);
  res.status(500).json({ error: 'Internal server error' });
}
