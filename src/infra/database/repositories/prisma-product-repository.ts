import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Product } from '@/domain/entities/products';
import { ProductRepository } from '@/domain/repositories/product-repository';
import { PrismaProductMapper } from '../mappers/prisma-product-mapper';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma-service';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(product: Product): Promise<void> {
    await this.prisma.product.create({
      data: PrismaProductMapper.toPrisma(product),
    });
  }
  async delete(productId: UniqueEntityID): Promise<void> {
    await this.prisma.product.delete({
      where: {
        id: productId.toString(),
      },
    });
  }
  async findById(productId: UniqueEntityID): Promise<Product | null> {
    const result = await this.prisma.product.findUnique({
      where: {
        id: productId.toString(),
      },
    });
    if (!result) {
      return null;
    }
    return PrismaProductMapper.toDomain(result);
  }
  async save(product: Product): Promise<Product> {
    const result = await this.prisma.product.update({
      data: PrismaProductMapper.toPrisma(product),
      where: {
        id: product.id.toString(),
      },
    });
    return PrismaProductMapper.toDomain(result);
  }
  async findByCategory(
    productCategory: string,
    page: number,
  ): Promise<Product[]> {
    const response = await this.prisma.product.findMany({
      where: {
        category: productCategory,
      },
      take: 20,
      skip: (page - 1) * 20,
      orderBy: { createdAt: 'asc' },
    });
    const promises = response.map((item) => PrismaProductMapper.toDomain(item));
    const result = await Promise.all(promises);
    return result;
  }
  async findByName(value: string, page: number): Promise<Product[]> {
    const response = await this.prisma.product.findMany({
      where: {
        name: {
          contains: value,
          mode: 'insensitive',
        },
      },
      take: 20,
      skip: (page - 1) * 20,
      orderBy: { createdAt: 'asc' },
    });
    const promises = response.map((item) => PrismaProductMapper.toDomain(item));
    const result = await Promise.all(promises);
    return result;
  }
}
