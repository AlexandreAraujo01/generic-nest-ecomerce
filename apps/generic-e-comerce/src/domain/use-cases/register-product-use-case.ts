import { Either, left, right } from '@/core/types/either';
import { ProductAlreadyExistsError } from './errors/product-already-exists-error';
import { Product } from '../entities/products';
import { ProductRepository } from '../repositories/product-repository';
import { Injectable } from '@nestjs/common';

export interface RegisterProductUseCaseRequest {
  name: string;
  price: number;
  category: string;
  available: boolean;
}

export type RegisterProductUseCaseResponse = Either<
  ProductAlreadyExistsError,
  { product: Product }
>;

@Injectable()
export class RegisterProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({
    name,
    price,
    available,
    category,
  }: RegisterProductUseCaseRequest): Promise<RegisterProductUseCaseResponse> {
    const productAlreadyExists = await this.productRepository.findByName(
      name,
      1,
    );
    if (productAlreadyExists.length >= 1) {
      return left(new ProductAlreadyExistsError());
    }
    const product = new Product({ name, price, available, category });
    await this.productRepository.create(product);
    return right({ product });
  }
}
