import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthController } from '../controllers/AuthController';
import { validateRequest } from '../middlewares/validateRequest';
import { registerUserSchema, loginUserSchema } from '../schemas/authSchemas';

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again in 15 minutes.' },
});

export function buildAuthRoutes(authController: AuthController): Router {
  const router = Router();

  router.post(
    '/register',
    authRateLimiter,
    validateRequest(registerUserSchema),
    authController.register,
  );

  router.post(
    '/login',
    authRateLimiter,
    validateRequest(loginUserSchema),
    authController.login,
  );

  return router;
}
