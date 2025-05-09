import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Cart } from '../entities/cart';
import { CartItem } from '../entities/cartItem';

export abstract class CartRepository {
  abstract create(
    userId: UniqueEntityID,
    items?: CartItem[],
  ): Promise<Cart | null>;

  abstract delete(cartId: UniqueEntityID): void;

  abstract insertItems(
    items: CartItem[],
    cartId: UniqueEntityID,
  ): Promise<Cart | null>;

  abstract removeItems(
    items: CartItem[],
    cartId: UniqueEntityID,
  ): Promise<Cart | null>;

  abstract findById(cartId: UniqueEntityID): Promise<Cart | null>;

  abstract findByUserId(userId: UniqueEntityID): Promise<Cart | null>;
}
