import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/services/prisma-service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Add product to cart (E2E)', () => {
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

  it('[POST] /cart/add → It should be able to add product to cart', async () => {
    await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      phone: '(11)91234-5678',
      role: 'ADMIN',
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

    const productResponse = await request(app.getHttpServer())
        .post('/product/register')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Product Example',
          price: 199.99,
          available: true,
          category: 't-shirt',
        });
    
    // creating a cart
    await request(app.getHttpServer())
    .post('/cart/create')
    .set('Authorization', `Bearer ${token}`)
    .send()


    const product = productResponse.body.product

    const response = await request(app.getHttpServer())
      .post('/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId: product.id,
        quantity: 1
      });


    const cart = await prisma.cart.findUnique({
      where: {userId: user?.id}
    })

    const cartItems = await prisma.cartItem.findMany({
      where: { cartId : cart?.id }
    })

    expect(response.statusCode).toEqual(204);
    expect(cartItems).toHaveLength(1)
    expect(cartItems[0].productId).toEqual(product.id)
    
  });
});
