import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectToMongo } from './infrastructure/database/MongoConnection';
import { buildContainer } from './container';
import { buildAuthRoutes } from './presentation/routes/authRoutes';
import { buildFavoriteRoutes } from './presentation/routes/favoriteRoutes';
import { buildAuthMiddleware } from './presentation/middlewares/authMiddleware';
import { errorHandler } from './presentation/middlewares/errorHandler';

const mongoReadyStates = ['disconnected', 'connected', 'connecting', 'disconnecting'] as const;

interface AppConfig {
  mongoUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
}

export async function createApp(config: AppConfig): Promise<express.Application> {
  await connectToMongo(config.mongoUri);

  const container = buildContainer(config.jwtSecret, config.jwtExpiresIn);

  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    const mongoStatus = mongoReadyStates[mongoose.connection.readyState as number] ?? 'unknown';
    res.json({
      status: 'ok',
      mongodb: mongoStatus,
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api/auth', buildAuthRoutes(container.authController));

  app.use(
    '/api/favorites',
    buildAuthMiddleware(container.tokenService),
    buildFavoriteRoutes(container.favoriteController),
  );

  app.use(errorHandler);

  return app;
}
