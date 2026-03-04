import { Request, Response, NextFunction } from 'express';
import { ITokenService } from '../../application/services/ITokenService';

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export function buildAuthMiddleware(tokenService: ITokenService) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token is required' });
    }

    const token = authorizationHeader.slice(7);
    const payload = tokenService.verify(token);

    if (!payload) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.userId = payload.userId;
    return next();
  };
}
