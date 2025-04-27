import { Entity } from 'src/core/entities/entity';
import { CartItem } from './cartItem';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';

export interface CartProps {
  items: CartItem[];
  userId: UniqueEntityID;
}

export class Cart extends Entity<CartProps> {
  constructor(props: CartProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get items(): CartItem[] {
    return this.props.items;
  }

  set items(values: CartItem[]) {
    this.items = values;
  }
}
