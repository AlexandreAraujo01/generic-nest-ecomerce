import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Product } from '../entities/products';

export abstract class ProductRepository {
  abstract create(product: Product): Promise<void>;

  abstract delete(productId: UniqueEntityID): Promise<void>;

  abstract findById(productId: UniqueEntityID): Promise<Product | null>;

  abstract save(product: Product): Promise<Product>;

  abstract findByCategory(
    productCategory: string,
    page: number,
  ): Promise<Product[]>;

  abstract findByName(value: string, page: number): Promise<Product[]>;
}
