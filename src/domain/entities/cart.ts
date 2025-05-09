import { Entity } from 'src/core/entities/entity';
import { CartItem } from './cartItem';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { CartItemWatchedList } from '@/core/entities/cart-items-watched-list';

export interface CartProps {
  items: CartItemWatchedList;
  userId: UniqueEntityID;
}

export class Cart extends Entity<CartProps> {
  constructor(props: CartProps, id?: UniqueEntityID) {
    super(props, id);
  }

  getCurrentItems(): CartItem[] {
    return this.props.items.currentItems;
  }

  getNewItems(): CartItem[] {
    return this.props.items.newItems;
  }

  getRemovedItems(): CartItem[] {
    return this.props.items.removedItems;
  }

  getInitialItems(): CartItem[] {
    return this.props.items.initialItems;
  }

  getAlteredItems(): CartItem[] {
    return this.props.items.alteredItems;
  }

  getUserId(): UniqueEntityID {
    return this.props.userId;
  }

  addItem(item: CartItem) {
    this.props.items.addItem(item);
  }

  removeItem(item: CartItem) {
    this.props.items.removeItem(item);
  }
}
