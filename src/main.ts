import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';
import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global API prefix
  app.setGlobalPrefix('api/v1');

  // Cookie parser for secure session cookies
  app.use(cookieParser(process.env.COOKIE_SECRET || 'blish-secure-cookie-secret-signature-2026'));

  // CORS configuration
  const origin = process.env.CORS_ORIGIN || 'http://localhost:3000';
  app.enableCors({
    origin: [origin, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  });

  // Strict validation pipe with mass assignment protection (whitelisting)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // Static uploads directory serving
  const uploadsDir = path.resolve(process.cwd(), 'uploads');
  app.use('/uploads', express.static(uploadsDir));

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 Blish Spa ERP API running on: http://localhost:${port}/api/v1`);
}

bootstrap();
