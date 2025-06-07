import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Product } from '@/domain/entities/products';
import { Prisma } from 'prisma/generated/prisma';
import { string } from 'zod';

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

  static fromJSON(data: any): Product {
    const typeId = typeof data.id
    if(data.props){
        return new Product({
          ...data.props
        }, typeId === "string" ? new UniqueEntityID(data.id) : 
        new UniqueEntityID(data._id.value))
    }else{
      return new Product({
          ...data
        }, typeId === "string" ? new UniqueEntityID(data.id) : 
        new UniqueEntityID(data._id.value))
    }
   
  }
  
  static toJSON(product: Product) {
  return {
    id: product.id.toString(),
    name: product.name,
    price: product.price,
    category: product.category,
    available: product.available,
  };
}

}
