import { Entity } from 'src/core/entities/entity'
import { CartItem } from './cartItem'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'

interface PaymentMethodProps {
  status: 'pending' | 'paid' | 'delivered' | 'canceled'
  paymentMethod: string
  items: CartItem[]
  createdAt: Date
  updatedAt: Date
}

export class PaymentMethod extends Entity<PaymentMethodProps> {
  constructor(props: PaymentMethodProps, id?: UniqueEntityID) {
    super(props, id)
  }
}
