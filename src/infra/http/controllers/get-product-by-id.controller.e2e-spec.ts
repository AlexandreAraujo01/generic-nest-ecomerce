import { AppModule } from '@/app.module';
import { Product } from '@/domain/entities/products';
import { PrismaService } from '@/infra/database/services/prisma-service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { MakeUserFactoryPrisma } from 'test/factories/make-user-factory';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Get Product by id (E2E)', () => {
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
    await prisma.cart.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  it('[POST] /product/details → It must be able to get product deitals by id', async () => {
    await userFactory.makePrismaUser({
      email: 'john@example.com',
      password: '123456',
      role: 'ADMIN',
    });


    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'john@example.com',
      password: '123456',
    });

    const token = response.body.access_token;

    const createProductResponse = await request(app.getHttpServer())
      .post('/product/register')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Product Example',
        price: 199.99,
        available: true,
        category: 't-shirt',
      });
    const result = await request(app.getHttpServer())
    .post('/product/details')
    .set('Authorization', `Bearer ${token}`)
    .send({
        productId: createProductResponse.body.product.id.toString()
    })

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(
      expect.objectContaining({
        name: 'Product Example',
      }),
    );
  });
});
