import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security headers
  app.use(helmet());

  // CORS — only allow the frontend origin
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Rate limiting — 100 requests per minute per IP
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      message: { message: 'Too many requests, please try again in a minute.' },
    }),
  );

  // Stricter limit specifically for auth endpoints — brute-force protection
  app.use(
    '/auth/login',
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 10,
      message: { message: 'Too many login attempts, please try again later.' },
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`API Gateway running on http://localhost:${port}`);
}
bootstrap();