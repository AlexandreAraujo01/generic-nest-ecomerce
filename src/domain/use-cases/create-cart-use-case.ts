import { CartItem } from '../entities/cartItem';
import { CartRepository } from '../repositories/cart-repository';
import { ProductRepository } from '../repositories/product-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { UserRepository } from '../repositories/user-repository';
import { Either, left, right } from '@/core/types/either';
import { NotFoundError } from './errors/not-found-error';
import { Cart } from '../entities/cart';
import { CartAlreadyExists } from './errors/cart-already-exists';

export interface CreateCartUseCaseRequest {
  userId: string;
  items: CartItem[];
}

export type CreateCartUseCaseResponse = Either<
  CartAlreadyExists | NotFoundError,
  Cart
>;

export class CreateCartUseCase {
  constructor(
    private userRepository: UserRepository,
    private productRepository: ProductRepository,
    private cartRepository: CartRepository,
  ) {}

  async execute({
    userId,
    items,
  }: CreateCartUseCaseRequest): Promise<CreateCartUseCaseResponse> {
    const user = await this.userRepository.findById(new UniqueEntityID(userId));
    if (!user) {
      return left(new NotFoundError('user not found'));
    }

    const promisesProduct = await Promise.all(
      items.map(async (item) => {
        const product = await this.productRepository.findById(item.productId);
        return product ? item : null;
      }),
    );

    const products = promisesProduct.filter((item) => item != null);

    const cart = await this.cartRepository.create(
      new UniqueEntityID(userId),
      products,
    );

    if (!cart) {
      return left(new CartAlreadyExists());
    }

    return right(cart);
  }
}
