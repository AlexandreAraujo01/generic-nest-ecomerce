import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product-repository';
import { CartRepository } from '../repositories/cart-repository';
import { CartItem } from '../entities/cartItem';
import { UserRepository } from '../repositories/user-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Either, left, right } from '@/core/types/either';
import { Cart } from '../entities/cart';
import { NotFoundError } from './errors/not-found-error';

export interface RemoveProductToCartUseCaseRequest {
  productId: string;
  userId: string;
  productQuantity: number;
}

export type RemoveProductToCartUseCaseResponse = Either<NotFoundError, Cart>;

@Injectable()
export class RemoveProductToCartUseCase {
  constructor(
    private productRepository: ProductRepository,
    private cartRepository: CartRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    userId,
    productId,
    productQuantity,
  }: RemoveProductToCartUseCaseRequest): Promise<RemoveProductToCartUseCaseResponse> {
    const user = await this.userRepository.findById(new UniqueEntityID(userId));
    if (!user) {
      return left(new NotFoundError('user not found'));
    }
    const cart = await this.cartRepository.findByUserId(
      new UniqueEntityID(userId),
    );

    if (!cart) {
      return left(new NotFoundError('cart not found'));
    }

    const productExists = await this.productRepository.findById(
      new UniqueEntityID(productId),
    );

    if (!productExists || productExists?.available === false) {
      console.log(
        productExists,
        productExists?.available,
        'productExists.available',
      );
      return left(new NotFoundError('product not available'));
    }

    const cartItem = new CartItem({
      item: productExists,
      quantity: productQuantity,
    });

    cart.removeItem(cartItem);
    return right(cart);
  }
}
