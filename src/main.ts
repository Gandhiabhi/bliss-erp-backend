import './load-env.js';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';
import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';
import { corsOrigins, requiredEnv } from './load-env.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global API prefix
  app.setGlobalPrefix('api/v1');

  // Cookie parser for secure session cookies
  app.use(cookieParser(requiredEnv('COOKIE_SECRET')));

  const origins = corsOrigins();
  app.enableCors({
    origin: origins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  });
  console.log(`CORS allows: ${origins.join(', ')}`);

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

  const port = Number(requiredEnv('PORT'));
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be a whole number from 1 to 65535.');
  }
  const host = process.env.HOST?.trim() || '0.0.0.0';
  await app.listen(port, host);
  console.log(`Blish Spa ERP API listening on ${host}:${port}`);
}

bootstrap();
