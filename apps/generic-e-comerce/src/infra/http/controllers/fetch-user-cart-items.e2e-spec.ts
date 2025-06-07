import { AppModule } from '@/app.module';
import { Product } from '@/domain/entities/products';
import { PrismaService } from '@common/common/modules/database/services/prisma-service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { MakeUserFactoryPrisma } from '@test/factories/make-user-factory';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('List Product items (E2E)', () => {
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

  it('[GET] /cart/list → It must be able to list all products from user cart', async () => {
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


    await request(app.getHttpServer())
          .post('/cart/create')
          .set('Authorization', `Bearer ${token}`)
          .send();
    
    const addProductOnCartResponse = await request(app.getHttpServer())
          .post('/cart/add')
          .set('Authorization', `Bearer ${token}`)
          .send({
            productId: createProductResponse.body.product.id,
            quantity: 1
          });

    const result = await request(app.getHttpServer())
    .get('/cart/list')
    .set('Authorization', `Bearer ${token}`)
    .send()

    expect(result.statusCode).toBe(200);
    expect(result.body.products[0]).toEqual(
      expect.objectContaining({
        name: 'Product Example',
      }),
    );
  });
});
