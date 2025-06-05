import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryUserRepository } from '@test/repositories/in-memory-user-repository';
import { DeleteUserUseCase } from './delete-user-use-case';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from './errors/not-allowed-error';
import { makeUserFactory } from '@test/factories/make-user-factory';

describe('Delete user use case', () => {
  let inMemoryUserRepository: InMemoryUserRepository;
  let sut: DeleteUserUseCase;
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    sut = new DeleteUserUseCase(inMemoryUserRepository);
  });

  it('should be able to delete an existing user', async () => {
    const user = makeUserFactory({ name: 'John Doe' });
    inMemoryUserRepository.items.push(user);
    const response = await sut.execute({ id: user.id });

    expect(response.isRight()).toBe(true);
    expect(inMemoryUserRepository.items).toHaveLength(0);
  });

  it('should not be allowed to delete a user with wrong id', async () => {
    const user = makeUserFactory({ name: 'John Doe' });
    inMemoryUserRepository.items.push(user);
    const response = await sut.execute({
      id: new UniqueEntityID('non-existing-id'),
    });
    expect(response.isLeft()).toBe(true);
    expect(inMemoryUserRepository.items).toHaveLength(1);
    expect(response.value).toBeInstanceOf(NotAllowedError);
  });
});
