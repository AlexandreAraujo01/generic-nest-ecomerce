import { faker } from '@faker-js/faker';
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
