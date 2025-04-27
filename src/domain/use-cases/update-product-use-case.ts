import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { ProductRepository } from '../repositories/product-repository';
import { NotFoundError } from './errors/not-found-error';
import { Either, left, right } from 'src/core/types/either';
import { Product } from '../entities/products';

export interface updateProductUseCaseRequest {
  id: string;
  name: string;
  price: number;
  category: string;
  available: boolean;
}

export type updateProductUseCaseResponse = Either<NotFoundError, Product>;
export class UpdateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({
    id,
    name,
    price,
    category,
    available,
  }: updateProductUseCaseRequest): Promise<updateProductUseCaseResponse> {
    const product = await this.productRepository.findById(
      new UniqueEntityID(id),
    );
    if (!product) {
      return left(new NotFoundError());
    }
    product.name = name;
    product.price = price;
    product.category = category;
    product.available = available;
    const savedProduct = await this.productRepository.save(product);
    return right(savedProduct);
  }
}
