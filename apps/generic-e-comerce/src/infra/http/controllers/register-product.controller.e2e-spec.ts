import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/services/prisma-service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { MakeUserFactoryPrisma } from '@test/factories/make-user-factory';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Register Product (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: MakeUserFactoryPrisma;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService, MakeUserFactoryPrisma],
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

  it('[POST] /product/register → It must be able to register a new Product', async () => {
    await userFactory.makePrismaUser({
      email: 'john@example.com',
      password: '123456',
      role: 'ADMIN',
    });

    // await prisma.user.findUnique({
    //   where: {
    //     email: 'john@example.com',
    //   },
    // });

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'john@example.com',
      password: '123456',
    });

    const token = response.body.access_token;

    const result = await request(app.getHttpServer())
      .post('/product/register')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Product Example',
        price: 199.99,
        available: true,
        category: 't-shirt',
      });
    const product = await prisma.product.findUnique({
      where: {
        name: 'Product Example',
      },
    });

    expect(result.statusCode).toBe(201);
    expect(result.body).toEqual({
      product: expect.objectContaining({
        name: 'Product Example',
      }),
    });
    expect(product).toBeTruthy();
  });
});
