import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Product } from 'src/domain/entities/products';
import { ProductRepository } from 'src/domain/repositories/product-repository';

export class InMemoryProductRepository implements ProductRepository {
  public items: Product[] = [];

  async create(product: Product): Promise<void> {
    this.items.push(product);
  }

  async delete(productId: UniqueEntityID): Promise<void> {
    this.items = this.items.filter((product) => !product.id.equals(productId));
  }

  async findById(productId: UniqueEntityID): Promise<Product | null> {
    const product = this.items.find((product) => product.id.equals(productId));
    if (!product) {
      return null;
    }
    return product;
  }

  async findByCategory(
    productCategory: string,
    page: number,
  ): Promise<Product[]> {
    const products = this.items
      .filter((item) => item.category === productCategory)
      .slice((page - 1) * 20, page * 20);
    return products;
  }

  async findByName(value: string): Promise<Product[]> {
    const products = this.items.filter((product) =>
      product.name.toLowerCase().includes(value.toLowerCase()),
    );
    return products;
  }

  async save(product: Product): Promise<Product> {
    const productIndex = this.items.findIndex((value) =>
      value.id.equals(product.id),
    );
    this.items[productIndex] = product;
    return product;
  }
}
