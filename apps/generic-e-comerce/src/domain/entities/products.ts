import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface ProductProps {
  name: string;
  price: number;
  category: string;
  available: boolean;
}

export class Product extends Entity<ProductProps> {
  constructor(props: ProductProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get name(): string {
    return this.props.name;
  }

  set name(value: string) {
    this.props.name = value;
  }

  get price(): number {
    return this.props.price;
  }

  set price(value: number) {
    this.props.price = value;
  }

  get category(): string {
    return this.props.category;
  }

  set category(value: string) {
    this.props.category = value;
  }

  get available(): boolean {
    return this.props.available;
  }

  set available(value: boolean) {
    this.props.available = value;
  }
}
