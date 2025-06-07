import { config } from 'dotenv';
import { randomUUID } from 'node:crypto';
import { execSync } from 'node:child_process';
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';
import { PrismaClient } from 'prisma/generated/prisma';
import { Redis } from 'ioredis';
import { envSchema } from '@/env/env';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthModule } from '@auth/auth.module';
import getPort from 'get-port';

config({ path: '.env', override: true });

const env = envSchema.parse(process.env);
const prisma = new PrismaClient();

let redis: Redis;
let authApp: Awaited<ReturnType<typeof NestFactory.create>>;
let port: number;
const schemaId = randomUUID();

function generateUniqueDatabaseURL(schemaId: string) {
  if (!env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable');
  }

  const url = new URL(env.DATABASE_URL);
  url.searchParams.set('schema', schemaId);
  return url.toString();
}

async function waitForServiceReady(port: number, retries = 15, delayMs = 300) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`http://localhost:${port}/health`);
      if (res.ok) return;
    } catch {
      // ignora erro
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  throw new Error('Auth microservice did not become ready in time');
}


beforeEach(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId);
  process.env.DATABASE_URL = databaseURL;
  process.env.REDIS_DB = '1';

  redis = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    db: Number(process.env.REDIS_DB),
  });

  await redis.flushdb();

  execSync('npx prisma migrate deploy');

  port = await getPort(); // salva fora para reutilizar
  process.env.AUTH_PORT = port.toString();
  console.log(port, process.env.AUTH_PORT, 'porta escolhida!!');

  authApp = await NestFactory.create(AuthModule);

  authApp.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [env.RABBIT_HOST],
      queue: 'auth_queue',
    },
  });

  await authApp.startAllMicroservices();
  await authApp.listen(port);
  await waitForServiceReady(port);
});

afterEach(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
  await redis.quit();

  if (authApp) {
    await authApp.close();
  }
});


