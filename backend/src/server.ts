import 'dotenv/config';
import { z } from 'zod';
import { createApp } from './app';

const envSchema = z.object({
  PORT: z.string().default('3333'),
  MONGODB_URI: z.string({ required_error: 'MONGODB_URI is required' }).min(1),
  JWT_SECRET: z.string({ required_error: 'JWT_SECRET is required' }).min(16),
  JWT_EXPIRES_IN: z.string().default('7d'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('[Config] Invalid environment variables:');
  parsed.error.errors.forEach((e) => console.error(`  - ${e.path.join('.')}: ${e.message}`));
  process.exit(1);
}

const env = parsed.data;

createApp({
  mongoUri: env.MONGODB_URI,
  jwtSecret: env.JWT_SECRET,
  jwtExpiresIn: env.JWT_EXPIRES_IN,
})
  .then((app) => {
    app.listen(Number(env.PORT), () => {
      console.log(`[Server] Running on port ${env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('[Server] Failed to start:', error);
    process.exit(1);
  });
