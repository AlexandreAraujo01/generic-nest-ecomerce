import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/services/prisma-service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { MakeProductFactoryPrisma } from 'test/factories/make-product-factory';
import { MakeUserFactoryPrisma } from 'test/factories/make-user-factory';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Update Product (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let makeUserFactoryPrisma: MakeUserFactoryPrisma;
  let makeProductFactoryPrisma: MakeProductFactoryPrisma;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        MakeUserFactoryPrisma,
        MakeProductFactoryPrisma,
        PrismaService,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    makeUserFactoryPrisma = new MakeUserFactoryPrisma(prisma);
    makeProductFactoryPrisma = new MakeProductFactoryPrisma(prisma);

    await app.init();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await app.close();
  });

  it('[POST] /update/product → It should be able to update a existing product', async () => {
    await makeUserFactoryPrisma.makePrismaUser({
      email: 'john@example.com',
      password: '123456',
      role: 'ADMIN',
    });

    const productCreated = await makeProductFactoryPrisma.makePrismaProduct({
      name: 'Example Product',
      price: 299.99,
      category: 't-shirt',
      available: true,
    });

    const responseToken = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        email: 'john@example.com',
        password: '123456',
      });

    const token = responseToken.body.access_token;

    const response = await request(app.getHttpServer())
      .post('/update/product')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId: productCreated.id.toString(),
        price: 199.99,
      });

    const changedProduct = await prisma.product.findUnique({
      where: {
        id: productCreated.id.toString(),
      },
    });
    expect(response.statusCode).toEqual(204);
    expect(changedProduct).toEqual(
      expect.objectContaining({
        price: 199.99,
      }),
    );
  });
});
