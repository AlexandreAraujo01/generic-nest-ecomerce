import { Entity } from 'src/core/entities/entity';
import { Product } from './products';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';

export interface CartItemProps {
  item: Product;
  quantity: number;
}

export class CartItem extends Entity<CartItemProps> {
  constructor(props: CartItemProps, id?: UniqueEntityID) {
    super(props, id);
  }

  clone() {
    return new CartItem({ item: this.item, quantity: this.quantity }, this.id);
  }

  get item(): Product {
    return this.props.item;
  }

  get productId(): UniqueEntityID {
    return this.props.item.id;
  }

  get productName(): string {
    return this.props.item.name;
  }

  get productPrice(): number {
    return this.props.item.price;
  }

  get productCategory(): string {
    return this.props.item.category;
  }

  get productDisponibility(): boolean {
    return this.props.item.available;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  set quantity(value: number) {
    this.props.quantity = value;
  }
}
