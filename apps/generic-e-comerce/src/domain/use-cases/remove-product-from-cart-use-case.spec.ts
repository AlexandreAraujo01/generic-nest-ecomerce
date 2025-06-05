import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryProductRepository } from '@test/repositories/in-memory-product-repository';
import { InMemoryCartRepository } from '@test/repositories/in-memory-cart-repository';
import { InMemoryUserRepository } from '@test/repositories/in-memory-user-repository';
import { makeProductFactory } from '@test/factories/make-product-factory';
import { makeUserFactory } from '@test/factories/make-user-factory';
import { CartItem } from '../entities/cartItem';
import { AddProductToCartUseCase } from './add-product-to-cart';
import { Cart } from '../entities/cart';
import { CartItemWatchedList } from '@/core/entities/cart-items-watched-list';
import { RemoveProductFromCartUseCase } from './remove-product-from-cart-use-case';

let sut: RemoveProductFromCartUseCase ;
let inMemoryproductRepository: InMemoryProductRepository;
let inMemoryuserRepository: InMemoryUserRepository;
let inMemorycartRepository: InMemoryCartRepository;

describe('Add product to cart use case', () => {
  beforeEach(() => {
    inMemoryproductRepository = new InMemoryProductRepository();
    inMemoryuserRepository = new InMemoryUserRepository();
    inMemorycartRepository = new InMemoryCartRepository();
    sut = new RemoveProductFromCartUseCase (
      inMemoryproductRepository,
      inMemorycartRepository,
      inMemoryuserRepository,
    );
  });

  it('should be able to remove product from cart', async () => {
    const user = makeUserFactory({ name: 'John Doe' });
    await inMemoryuserRepository.create(user);
    const products: CartItem[] = [];
    for (let i = 0; i < 3; i++) {
      const product = makeProductFactory({ name: `product example ${i + 1}` });
      await inMemoryproductRepository.create(product);
      const cartItem = new CartItem({ item: product, quantity: 1 });
      products.push(cartItem);
    }

    const newProduct = makeProductFactory({ name: 'product example 3' });
    await inMemoryproductRepository.create(newProduct);

    const cart = new Cart({
      items: new CartItemWatchedList(products),
      userId: user.id,
      createdAt: new Date()
    });

    inMemorycartRepository.items.push(cart);

    const response = await sut.execute({
      productId: newProduct.id.toString(),
      productQuantity: 1,
      userId: user.id.toString(),
    });
    
    expect(response.isRight()).toBe(true);
    expect(inMemorycartRepository.items[0].userId).toEqual(user.id);
    expect(
      inMemorycartRepository.items[0].removedItems[0].productName,
    ).toEqual('product example 3');
  });
});
