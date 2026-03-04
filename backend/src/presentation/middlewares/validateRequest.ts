import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

type RequestPart = 'body' | 'query' | 'params';

export function validateRequest(schema: ZodSchema, part: RequestPart = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[part]);

    if (!result.success) {
      const formattedErrors = (result.error as ZodError).errors.map((error) => ({
        field: error.path.join('.'),
        message: error.message,
      }));

      return res.status(400).json({
        error: 'Validation failed',
        details: formattedErrors,
      });
    }

    req[part] = result.data;
    return next();
  };
}
