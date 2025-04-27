import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/services/prisma-service';
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
    await prisma.user.deleteMany();
    await app.close();
  });

  it('[POST] /accounts → It must be able to create a new user', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      phone: '(11)91234-5678',
    });

    expect(response.statusCode).toBe(201);

    const user = await prisma.user.findUnique({
      where: {
        email: 'john@example.com',
      },
    });

    expect(user).toBeTruthy();
    expect(user?.name).toBe('John Doe');
  });

  it('[POST] /accounts → It must return status 409 if the email already exists.', async () => {
    // Cria o usuário antes
    await prisma.user.create({
      data: {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'hashed_password',
        phone: '11912345678',
        role: 'USER',
      },
    });

    // Tenta cadastrar com o mesmo e-mail
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: '123456',
      phone: '11912345678',
    });

    expect(response.statusCode).toBe(409);
    expect(response.body.message).toBe('User Already Exists');
  });

  it('[POST] /accounts → It must return status 400 if the phone number is invalid.', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'Invalid Phone',
      email: 'invalid@phone.com',
      password: '123456',
      phone: '1234',
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toContain('Validation failed');
  });
});
