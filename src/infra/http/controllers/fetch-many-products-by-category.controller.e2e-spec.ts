import { AppModule } from '@/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaProductMapper } from '@/infra/database/mappers/prisma-product-mapper';
import { PrismaService } from '@/infra/database/services/prisma-service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { makeProductFactory } from 'test/factories/make-product-factory';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Fetch products by category (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PrismaService],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await app.close();
  });

  it('[GET] /:category/products/:page → It must be able to fetch products by category', async () => {
    for (let i = 0; i < 22; i++) {
      const product = makeProductFactory({
        name: `product ${i}`,
        category: `t-shirt`,
      });
      await prisma.product.create({
        data: PrismaProductMapper.toPrisma(product),
      });
    }
    const response = await request(app.getHttpServer())
      .get('/search/products/category?category=t-shirt&page=2')
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body.products).toHaveLength(2);
    expect(response.body).toEqual({
      products: expect.arrayContaining([
        expect.objectContaining({ name: 'product 20' }),
        expect.objectContaining({ name: 'product 21' }),
      ]),
    });
  });
});
