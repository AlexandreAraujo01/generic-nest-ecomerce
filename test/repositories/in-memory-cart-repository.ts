import { CartItemWatchedList } from '@/core/entities/cart-items-watched-list';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Cart } from '@/domain/entities/cart';
import { CartItem } from '@/domain/entities/cartItem';
import { CartRepository } from '@/domain/repositories/cart-repository';

export class InMemoryCartRepository implements CartRepository {
  public items: Cart[] = [];

  async findByUserId(userId: UniqueEntityID): Promise<Cart | null> {
    const cart = this.items.find((item) => item.userId.equals(userId));
    if (!cart) {
      return null;
    }
    return cart;
  }

  async findById(cartId: UniqueEntityID): Promise<Cart | null> {
    const cart = this.items.find((item) => item.id.equals(cartId));
    if (!cart) {
      return null;
    }
    return cart;
  }

  async create(cart: Cart): Promise<Cart | null> {
    const cartAlreadyExist = this.items.find((item) => item.userId.equals(cart.userId));
    if(cartAlreadyExist){
      return null
    }

    this.items.push(cart)
    return cart
  }

  
  delete(cartId: UniqueEntityID): void {
    const cartIndex = this.items.findIndex((item) => item.id === cartId);
    this.items.splice(cartIndex, 1);
  }

  async insertItems(cart: Cart): Promise<Cart | null> {
    const cartExistsIndex = this.items.findIndex((item) => item.id.equals(cart.id))
    if(cartExistsIndex < 0){
      return null
    }
    this.items[cartExistsIndex] = cart
    return cart
  }

  async removeItems(
    items: CartItem[],
    cartId: UniqueEntityID,
  ): Promise<Cart | null> {
    const cart = await this.findById(cartId);
    if (!cart) {
      return null;
    }
    items.map((item) => cart.removeItem(item));
    return cart;
  }
}
