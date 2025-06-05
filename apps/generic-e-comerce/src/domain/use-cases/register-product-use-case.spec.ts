import { beforeEach, describe, expect, it } from 'vitest';
import { RegisterProductUseCase } from './register-product-use-case';
import { InMemoryProductRepository } from '@test/repositories/in-memory-product-repository';
import { makeProductFactory } from '@test/factories/make-product-factory';
import { ProductAlreadyExistsError } from './errors/product-already-exists-error';

describe('Register product use case', () => {
  let sut: RegisterProductUseCase;
  let inMemoryProductRepository: InMemoryProductRepository;
  beforeEach(() => {
    inMemoryProductRepository = new InMemoryProductRepository();
    sut = new RegisterProductUseCase(inMemoryProductRepository);
  });

  it('Should be able to register a new product', async () => {
    const result = await sut.execute({
      name: 'Amazing T-SHIRT',
      price: 199.99,
      available: true,
      category: 'T-SHIRT',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryProductRepository.items).toHaveLength(1);
    expect(inMemoryProductRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'Amazing T-SHIRT',
      }),
    );
  });

  it('should not be allowed to register a product that already have been registered', async () => {
    const product = makeProductFactory({ name: 'Amazing T-SHIRT' });
    inMemoryProductRepository.items.push(product);

    const result = await sut.execute({
      name: 'Amazing T-SHIRT',
      price: 199.99,
      available: true,
      category: 'T-SHIRT',
    });

    expect(result.isLeft());
    expect(result.value).toBeInstanceOf(ProductAlreadyExistsError);
  });
});
