import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Cart } from '../entities/cart';
import { CartItem } from '../entities/cartItem';

export abstract class CartRepository {
  abstract create(
    cart: Cart
  ): Promise<Cart | null>;

  abstract delete(cartId: UniqueEntityID): void;

  abstract insertItems(cart: Cart): Promise<Cart | null>;

  abstract removeItems(cart: Cart): Promise<Cart | null>;

  abstract findById(cartId: UniqueEntityID): Promise<Cart | null>;

  abstract findByUserId(userId: UniqueEntityID): Promise<Cart | null>;
}
