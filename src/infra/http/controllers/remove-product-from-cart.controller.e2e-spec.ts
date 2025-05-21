import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/services/prisma-service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { beforeEach } from 'node:test';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Add product to cart (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach()

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

  it('[POST] /cart/remove → It should be able to decrement a product quantity on cart', async () => {
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

    await request(app.getHttpServer())
      .post('/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId: product.id,
        quantity: 3
      });

      const response = await request(app.getHttpServer())
      .post('/cart/remove')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId: product.id,
        quantity: 2
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
    expect(cartItems[0].quantity).toEqual(1)
    
  });


  it('[POST] /cart/remove → It should be able to remove a product from the cart if its quantity is zero or below.', async () => {
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
          name: 'Product Example 2',
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

    await request(app.getHttpServer())
      .post('/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId: product.id,
        quantity: 1
      });

      const response = await request(app.getHttpServer())
      .post('/cart/remove')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId: product.id,
        quantity: 1
      });


    
    const fetchProductsResponse = await request(app.getHttpServer())
    .get('/cart/list')
    .set('Authorization', `Bearer ${token}`)
    .send()

    console.log(fetchProductsResponse, 'fetchProductsResponse')
    expect(response.statusCode).toEqual(204);
    expect(fetchProductsResponse.body.products).not.toContainEqual(
                  expect.objectContaining({ id: product.id })
                );
    
  });
});
