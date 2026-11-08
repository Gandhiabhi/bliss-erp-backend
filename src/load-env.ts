import { config } from 'dotenv';

config();

export function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing environment variable ${name}. Copy .env.example to .env and set it before starting the API.`);
  }
  return value;
}

function splitOrigins(value: string | undefined) {
  return (value || '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);
}

export function corsOrigins(): string[] {
  const origins = [...new Set([...splitOrigins(process.env.CORS_ORIGIN), ...splitOrigins(process.env.FRONTEND_URL)])];
  if (origins.length === 0) {
    throw new Error('Set CORS_ORIGIN in the backend .env to the frontend address. Separate extra sites with a comma.');
  }
  return origins;
}
