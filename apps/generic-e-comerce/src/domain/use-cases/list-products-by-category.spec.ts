import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryProductRepository } from '@test/repositories/in-memory-product-repository';
import { makeProductFactory } from '@test/factories/make-product-factory';
import { ListProductsByCategoryUseCase } from './list-products-by-category';

describe('List Products by category', () => {
  let inMemoryProductRepository: InMemoryProductRepository;
  let sut: ListProductsByCategoryUseCase;
  beforeEach(() => {
    inMemoryProductRepository = new InMemoryProductRepository();
    sut = new ListProductsByCategoryUseCase(inMemoryProductRepository);
  });

  it('Should be able to list products by category', async () => {
    for (let i = 0; i < 22; i++) {
      const currentProduct = makeProductFactory({
        name: `Product ${i}`,
        category: 'T-SHIRT',
      });
      inMemoryProductRepository.items.push(currentProduct);
    }

    const response = await sut.execute({ category: 'T-SHIRT', page: 2 });
    expect(response.isRight()).toBe(true);
    expect(response.value).toEqual({
      products: [
        expect.objectContaining({
          name: 'Product 20',
        }),
        expect.objectContaining({
          name: 'Product 21',
        }),
      ],
    });
  });
});
