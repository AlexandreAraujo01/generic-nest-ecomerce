import { PrismaProductMapper } from '@/infra/database/mappers/prisma-product-mapper';
import { PrismaService } from '@/infra/database/services/prisma-service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Product, ProductProps } from 'src/domain/entities/products';

export function MakeProductFactory(
  props: Partial<ProductProps>,
  id?: UniqueEntityID,
): Product {
  const product = new Product(
    {
      name: faker.lorem.word(),
      price: faker.number.float(),
      available: true,
      category: 'T-SHIRT',
      ...props,
    },
    id,
  );

  return product;
}

@Injectable()
export class MakeProductFactoryPrisma {
  constructor(private prisma: PrismaService) {}

  async makePrismaProduct(props: Partial<ProductProps>, id?: string) {
    const product = MakeProductFactory(props, new UniqueEntityID(id));
    await this.prisma.product.create({
      data: PrismaProductMapper.toPrisma(product),
    });
    return product;
  }
}
