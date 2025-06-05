import { beforeEach, describe, expect, it } from 'vitest';
import { CreateCartUseCase } from './create-cart-use-case';
import { InMemoryProductRepository } from '@test/repositories/in-memory-product-repository';
import { InMemoryCartRepository } from '@test/repositories/in-memory-cart-repository';
import { InMemoryUserRepository } from '@test/repositories/in-memory-user-repository';
import { makeProductFactory } from '@test/factories/make-product-factory';
import { makeUserFactory } from '@test/factories/make-user-factory';
import { CartItem } from '../entities/cartItem';

let sut: CreateCartUseCase;
let inMemoryproductRepository: InMemoryProductRepository;
let inMemoryuserRepository: InMemoryUserRepository;
let inMemorycartRepository: InMemoryCartRepository;

describe('Create cart use case', () => {
  beforeEach(() => {
    inMemoryproductRepository = new InMemoryProductRepository();
    inMemoryuserRepository = new InMemoryUserRepository();
    inMemorycartRepository = new InMemoryCartRepository();
    sut = new CreateCartUseCase(
      inMemoryuserRepository,
      inMemoryproductRepository,
      inMemorycartRepository,
    );
  });

  it('should be able to create a cart', async () => {
    const user = makeUserFactory({ name: 'John Doe' });
    await inMemoryuserRepository.create(user);
    const products: CartItem[] = [];
    for (let i = 0; i < 3; i++) {
      const product = makeProductFactory({ name: `product example ${i + 1}` });
      await inMemoryproductRepository.create(product);
      const cartItem = new CartItem({ item: product, quantity: 1 });
      products.push(cartItem);
    }

    const response = await sut.execute({
      items: products,
      userId: user.id.toString(),
      createdAt: new Date(),
    });

    const currentItems = inMemorycartRepository.items[0].currentItems;
    const initialItems = inMemorycartRepository.items[0].initialItems;
    const userId = inMemorycartRepository.items[0].userId;

    expect(response.isRight()).toBe(true);
    expect(inMemorycartRepository.items).toHaveLength(1);
    expect(currentItems[2].productName).toEqual('product example 3');
    expect(initialItems[2].productName).toEqual('product example 3');
    expect(userId).toEqual(user.id);
  });
});
