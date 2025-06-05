import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/services/prisma-service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { MakeUserFactoryPrisma } from '@test/factories/make-user-factory';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Login User (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: MakeUserFactoryPrisma;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [MakeUserFactoryPrisma, PrismaService],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    userFactory = moduleRef.get(MakeUserFactoryPrisma);

    await app.init();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await app.close();
  });

  it('[POST] /accounts → It must be able to login', async () => {
    await userFactory.makePrismaUser({
      email: 'john@example.com',
      password: '123456',
    });

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'john@example.com',
      password: '123456',
    });

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual({ access_token: expect.any(String) });
  });

  it('[POST] /accounts → It should not  be able to login with wrong password', async () => {
    await userFactory.makePrismaUser({
      email: 'johndoe@example.com',
      password: '123456',
    });

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456789',
    });

    expect(response.statusCode).toBe(401);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'Unauthorized',
      }),
    );
  });
});
