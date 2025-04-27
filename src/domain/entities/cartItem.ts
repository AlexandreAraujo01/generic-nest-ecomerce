import { Entity } from 'src/core/entities/entity'
import { Product } from './products'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'

export interface CartItemProps {
  item: Product
  quantity: number
}

export class CartItem extends Entity<CartItemProps> {
  constructor(props: CartItemProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get item(): Product {
    return this.props.item
  }

  get quantity(): number {
    return this.props.quantity
  }

  set quantity(value: number) {
    this.quantity = value
  }
}
