import { beforeEach, describe, expect, it } from 'vitest';
import { makeProductFactory } from '@test/factories/make-product-factory';
import { InMemoryProductRepository } from '@test/repositories/in-memory-product-repository';
import { UpdateProductUseCase } from './update-product-use-case';
import { NotFoundError } from './errors/not-found-error';

describe('Update product use case', () => {
  let inMemoryProductRepository: InMemoryProductRepository;
  let sut: UpdateProductUseCase;
  beforeEach(() => {
    inMemoryProductRepository = new InMemoryProductRepository();
    sut = new UpdateProductUseCase(inMemoryProductRepository);
  });

  it('should be able to update an existing product', async () => {
    const product = makeProductFactory({ name: 'Product 1', price: 299.99 });
    inMemoryProductRepository.items.push(product);

    const response = await sut.execute({
      price: 199.99,
      name: 'Product 1',
      available: product.available,
      category: product.category,
      id: product.id.toString(),
    });

    expect(response.isRight()).toBe(true);
    expect(response.value).toEqual(
      expect.objectContaining({
        price: 199.99,
        name: 'Product 1',
      }),
    );
  });

  it('should not be allowed to update a product with a non existing id', async () => {
    const product = makeProductFactory({ name: 'Product 1', price: 299.99 });
    inMemoryProductRepository.items.push(product);
    const response = await sut.execute({
      price: 199.99,
      name: 'Product 1',
      available: product.available,
      category: product.category,
      id: 'non-existing-id',
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(NotFoundError);
  });
});
