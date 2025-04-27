import { Either, right } from 'src/core/types/either';
import { Product } from '../entities/products';
import { ProductRepository } from '../repositories/product-repository';
import { Injectable } from '@nestjs/common';

export interface ListProductsByNameRequest {
  name: string;
  page: number;
}

export type ListProductsByNameResponse = Either<null, { products: Product[] }>;
@Injectable()
export class ListProductsByNameUseCase {
  constructor(private productRepository: ProductRepository) {}
  async execute({
    name,
    page,
  }: ListProductsByNameRequest): Promise<ListProductsByNameResponse> {
    const products = await this.productRepository.findByName(name, page);
    return right({ products });
  }
}
