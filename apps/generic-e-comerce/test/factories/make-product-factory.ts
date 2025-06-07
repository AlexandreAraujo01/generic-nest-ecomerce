
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Product, ProductProps } from '@/domain/entities/products';
import { PrismaService } from '@common/common/modules/database/services/prisma-service';
import { PrismaProductMapper } from '@common/common/modules/database/mappers/prisma-product-mapper';

export function makeProductFactory(
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
    const product = makeProductFactory(props, new UniqueEntityID(id));
    await this.prisma.product.create({
      data: PrismaProductMapper.toPrisma(product),
    });
    return product;
  }
}
