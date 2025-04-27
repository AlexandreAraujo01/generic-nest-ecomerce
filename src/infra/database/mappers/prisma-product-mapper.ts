import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Product } from '@/domain/entities/products';
import { Prisma } from 'prisma/generated/prisma';

export class PrismaProductMapper {
  static toPrisma(product: Product): Prisma.ProductUncheckedCreateInput {
    const prismaProduct = {
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      category: product.category,
      available: product.available,
    };

    return prismaProduct;
  }

  static toDomain(product: Prisma.ProductUncheckedCreateInput): Product {
    const domainProduct = new Product(
      {
        name: product.name,
        price: product.price,
        category: product.category,
        available: product.available ?? true,
      },
      new UniqueEntityID(product.id),
    );

    return domainProduct;
  }
}
