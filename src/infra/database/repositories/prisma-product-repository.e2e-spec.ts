import { AppModule } from '@/app.module';
import { Product } from '@/domain/entities/products';
import { CacheRepository } from '@/infra/cache/cache-repository';
import { PrismaService } from '@/infra/database/services/prisma-service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { MakeUserFactoryPrisma } from 'test/factories/make-user-factory';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { productPresenter } from '../presenters/product.presenter';
import { PrismaProductMapper } from '../mappers/prisma-product-mapper';

describe('Get Product by id (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: MakeUserFactoryPrisma;
  let cacheRepository: CacheRepository
  let productIdCreated: string

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService, MakeUserFactoryPrisma],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    userFactory = moduleRef.get(MakeUserFactoryPrisma);
    cacheRepository = moduleRef.get(CacheRepository)

    await app.init();
  });

  afterAll(async () => {
    await prisma.cart.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  it('[POST] /product/details → It must be able to cash product details', async () => {
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

    productIdCreated = createProductResponse.body.product.id.toString()

    const result = await request(app.getHttpServer())
    .post('/product/details')
    .set('Authorization', `Bearer ${token}`)
    .send({
        productId: createProductResponse.body.product.id.toString()
    })

    const rawCached = await cacheRepository.get(`product:${createProductResponse.body.product.id.toString()}`)
    if(rawCached){
      const json_cached = JSON.parse(rawCached)
      const plain = productPresenter(PrismaProductMapper.fromJSON(json_cached))
      expect(plain).toEqual(result.body)
    }
    
  });

   it('[POST] /product/details → it should return cached product details from subsequent calls', async () => {
    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'john@example.com',
      password: '123456',
    });

    const token = response.body.access_token;

    const raw = await cacheRepository.get(`product:${productIdCreated}`)
    let productDomain;
    if (raw) {
  const json = JSON.parse(raw)
  productDomain = PrismaProductMapper.fromJSON(json)
  productDomain.name = 'cached product from redis'
}

await cacheRepository.set(
  `product:${productIdCreated}`,
  JSON.stringify(PrismaProductMapper.toJSON(productDomain))
)

    const result = await request(app.getHttpServer())
    .post('/product/details')
    .set('Authorization', `Bearer ${token}`)
    .send({
        productId: productIdCreated
    })
    expect(result.body.name).toEqual('cached product from redis')
  });
});
