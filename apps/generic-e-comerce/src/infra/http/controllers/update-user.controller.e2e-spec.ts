import { AppModule } from '@/app.module';
import { PrismaService } from '@common/common/modules/database/services/prisma-service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Update User (E2E)', () => {
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

  it('[POST] /accounts/update → It should be able to update a existing user', async () => {
    await request(app.getHttpServer()).post('/accounts').send({
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
    console.log(token, 'olha o token!')

    const response = await request(app.getHttpServer())
      .post('/accounts/update')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: user?.id.toString(),
        email: 'john_doe@example.com',
      });
      
      console.log(response.body, 'response olha aqui')

    const updatedUser = await prisma.user.findUnique({
      where: { id: user?.id },
    });
    expect(response.statusCode).toEqual(204);
    expect(updatedUser?.email).toBe('john_doe@example.com');
  });
});
