import { beforeEach, describe, expect, it } from 'vitest';
import { CartItemWatchedList } from './cart-items-watched-list';
import { MakeProductFactory } from 'test/factories/make-product-factory';
import { CartItem } from '@/domain/entities/cartItem';

let sut: CartItemWatchedList;

const initialProduct = MakeProductFactory({ name: 'initial Item 1' });

describe('Cart item watched list', () => {
  beforeEach(() => {
    const initialItem = new CartItem({ item: initialProduct, quantity: 1 });
    const initalItems = [initialItem];
    sut = new CartItemWatchedList(initalItems);
  });

  it('Should be able to add a new item on cart', () => {
    const newProduct = MakeProductFactory({ name: 'New item 1' });
    const newCartItem = new CartItem({ item: newProduct, quantity: 1 });
    sut.addItem(newCartItem);

    console.log(newCartItem.productName, 'New cart item');
    expect(sut.currentItems).toHaveLength(2);
    expect(sut.newItems).toHaveLength(1);
    expect(sut.newItems[0].productName).toEqual('New item 1');
  });

  it('Should be able to increase quantity of a product that is already in cart', () => {
    const newProduct = MakeProductFactory({ name: 'New item 1' });
    const newCartItem = new CartItem({ item: newProduct, quantity: 1 });
    sut.addItem(newCartItem);
    sut.addItem(newCartItem);
    expect(sut.currentItems).toHaveLength(2);
    expect(sut.newItems).toHaveLength(1);
    expect(sut.currentItems[1].quantity).toEqual(2);
    expect(sut.newItems[0].quantity).toEqual(2);
  });

  // it('Should no be allowed to duplicate items only increment')

  it('should be able to only increment quantity on a item that is already add iniatily', () => {
    const productItem = new CartItem({ item: initialProduct, quantity: 1 });
    sut.addItem(productItem);
    expect(sut.alteredItems[0].quantity).toEqual(2);
  });

  it('should be able to decrement an item quantity', () => {
    const productItem = new CartItem({ item: initialProduct, quantity: 1 });
    const newProduct = MakeProductFactory({ name: 'new product item x' });
    const newProductItem = new CartItem({
      item: newProduct,
      quantity: 2,
    });
    sut.addItem(productItem);
    sut.addItem(newProductItem);
    sut.removeItem(productItem);
    sut.removeItem(new CartItem({ item: newProduct, quantity: 1 }));
    expect(sut.alteredItems[0].quantity).toEqual(1);
    expect(sut.newItems[0].quantity).toEqual(1);
  });

  it('should be able to delete an item from the cart if its quantity is 0 or below', () => {
    const newProduct = MakeProductFactory({ name: 'new product item' });
    sut.addItem(new CartItem({ item: newProduct, quantity: 1 }));
    sut.removeItem(new CartItem({ item: newProduct, quantity: 1 }));
    expect(sut.removedItems.length).toEqual(0);
  });

  it('Should be able to add a new item on cart even it was removed before', () => {
    const newProduct = MakeProductFactory({ name: 'New item 1' });
    const newCartItem = new CartItem({ item: newProduct, quantity: 1 });
    sut.addItem(newCartItem);
    sut.removeItem(newCartItem);
    sut.addItem(newCartItem);
    expect(sut.currentItems).toHaveLength(2);
    expect(sut.newItems).toHaveLength(1);
    expect(sut.removedItems).toHaveLength(0);
  });
});
