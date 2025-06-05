import { Entity } from '@/core/entities/entity';
import { CartItem } from './cartItem';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { CartItemWatchedList } from '@/core/entities/cart-items-watched-list';

export interface CartProps {
  items: CartItemWatchedList;
  userId: UniqueEntityID;
  createdAt: Date
  updatedAt?: Date
}

export class Cart extends Entity<CartProps> {
  constructor(props: CartProps, id?: UniqueEntityID) {
    super(props, id);
  }


  get currentItems(): CartItem[] {
    return this.props.items.currentItems;
  }

  get newItems(): CartItem[] {
    return this.props.items.newItems;
  }

  get removedItems(): CartItem[] {
    return this.props.items.removedItems;
  }

  get initialItems(): CartItem[] {
    return this.props.items.initialItems;
  }

  get alteredItems(): CartItem[] {
    return this.props.items.alteredItems;
  }

  get userId(): UniqueEntityID {
    return this.props.userId;
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | null {
    if(!this.props.updatedAt){
      return null
    }
    return this.props.updatedAt
  }

  set updatedAt(updatedAt: Date){
    this.props.updatedAt = updatedAt
  }

  addItem(item: CartItem) {
    this.props.items.addItem(item);
  }

  removeItem(item: CartItem) {
    this.props.items.removeItem(item);
  }
}
