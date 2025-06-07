// ✅ Carregar dotenv ANTES de qualquer outra coisa
import { config } from 'dotenv';
config({ path: '.env', override: true });

// ✅ Somente depois os outros imports
import { randomUUID } from 'node:crypto';
import { execSync } from 'node:child_process';
import { afterAll, beforeAll } from 'vitest';
import { envSchema } from '@/env/env';
import { PrismaClient } from 'prisma/generated/prisma';
import { Redis } from 'ioredis';
import { Test } from '@nestjs/testing';
import { AuthModule } from '@auth/auth.module';
import { Transport } from '@nestjs/microservices';
import { EnvModule } from '@/env/env.module';
import { ConfigModule } from '@nestjs/config';
import { INestApplication, INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';

// ✅ Valida as variáveis de ambiente depois que todas foram carregadas
const env = envSchema.parse(process.env);

let prisma: PrismaClient;
let authService: INestMicroservice;
let redis: Redis;
let app: INestApplication

function generateUniqueDatabaseURL(schemaId: string) {
  if (!env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable');
  }

  const url = new URL(env.DATABASE_URL);
  url.searchParams.set('schema', schemaId);
  return url.toString();
}

const schemaId = randomUUID();


beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId);

  process.env.DATABASE_URL = databaseURL;
  process.env.REDIS_DB = '1';

  console.log('[DEBUG] DATABASE_URL =', process.env.DATABASE_URL);

  execSync('npx prisma migrate deploy', { env: { ...process.env, DATABASE_URL: databaseURL } }); // ⚠️ ANTES de inicializar o Prisma e o AuthService

  prisma = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
  });

  await prisma.$connect();

  app = await NestFactory.create(AppModule);
  await app.init();

  const moduleRef = await Test.createTestingModule({
    imports: [
      AuthModule,
      EnvModule,
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: ['.env'], // ✅ só usa .env mesmo
      }),
    ],
  }).compile();

  authService = moduleRef.createNestMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBIT_HOST],
      queue: 'auth_queue',
      retryAttempts: 5,
      retryDelay: 1000,
    },
  });

  await authService.listen();

  console.log(`[TEST] AuthService is connected to RabbitMQ on queue 'auth_queue'`);

  redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    db: Number(process.env.REDIS_DB),
  });

  await redis.flushdb();

  console.log('[TEST] Using schema:', schemaId);
});


afterAll(async () => {
  await prisma.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`
  );
  await prisma.$disconnect();
  await authService.close();
});
