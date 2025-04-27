import { Either, right } from 'src/core/types/either';
import { Product } from '../entities/products';
import { ProductRepository } from '../repositories/product-repository';
import { Injectable } from '@nestjs/common';

export interface ListProductsByCategoryRequest {
  category: string;
  page: number;
}

export type ListProductsByCategoryResponse = Either<
  null,
  { products: Product[] }
>;
@Injectable()
export class ListProductsByCategoryUseCase {
  constructor(private productRepository: ProductRepository) {}
  async execute({
    category,
    page,
  }: ListProductsByCategoryRequest): Promise<ListProductsByCategoryResponse> {
    const products = await this.productRepository.findByCategory(
      category,
      page,
    );
    return right({ products });
  }
}
