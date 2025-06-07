import { AppModule } from '@/app.module';
import { PrismaService } from '@common/common/modules/database/services/prisma-service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Create cart (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('[POST] /cart/create → It should be able to create a cart', async () => {
    const response1 = await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      phone: '(11)91234-5678',
    });


    const user = await prisma.user.findUnique({
      where: {
        email: 'john@example.com',
      },
    });



    const responseToken = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        email: 'john@example.com',
        password: '123456',
      });

    const token = responseToken.body.access_token;



    const response = await request(app.getHttpServer())
      .post('/cart/create')
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual(expect.objectContaining({
        cartId: expect.any(String)
    }))
  });
});
