import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';
import { makeUserFactory } from 'test/factories/make-user-factory';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { NotAllowedError } from './errors/not-allowed-error';
import { UpdateUserUseCase } from './update-user-use-case';
import { MakeAdressFactory } from 'test/factories/make-adress-factory';
import { FakeHashEncoderDecoder } from 'test/helpers/fake-hash-encoder';

describe('Update user use case', () => {
  let inMemoryUserRepository: InMemoryUserRepository;
  let fakeHashEncoderDecoder: FakeHashEncoderDecoder;
  let sut: UpdateUserUseCase;
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    fakeHashEncoderDecoder = new FakeHashEncoderDecoder();
    sut = new UpdateUserUseCase(inMemoryUserRepository, fakeHashEncoderDecoder);
  });

  it('should be able to update an existing user', async () => {
    const user = makeUserFactory({ name: 'John Doe' });
    inMemoryUserRepository.items.push(user);

    const newAdress = MakeAdressFactory({});
    const response = await sut.execute({
      userId: user.id.toString(),
      email: user.email,
      name: user.name,
      password: user.password,
      phone: user.phone,
      addresses: [newAdress],
      userLoggedId: user.id.toString(),
    });

    expect(response.isRight()).toBe(true);
    expect(inMemoryUserRepository.items[0].addresses.currentItems[0]).toEqual(
      newAdress,
    );
  });

  it('It should be able for an ADMIN to update an existing user.', async () => {
    const user = makeUserFactory({ name: 'John Doe' });
    const adminUser = makeUserFactory({ name: 'ADMIN', role: 'ADMIN' });
    inMemoryUserRepository.items.push(user);
    inMemoryUserRepository.items.push(adminUser);

    const newAdress = MakeAdressFactory({});
    const response = await sut.execute({
      userId: user.id.toString(),
      email: user.email,
      name: user.name,
      password: user.password,
      phone: user.phone,
      addresses: [newAdress],
      userLoggedId: adminUser.id.toString(),
    });

    expect(response.isRight()).toBe(true);
    expect(inMemoryUserRepository.items[0].addresses.currentItems[0]).toEqual(
      newAdress,
    );
  });

  it('should not be allowed to update a user with a non existing id', async () => {
    const user = makeUserFactory({ name: 'John Doe' });
    inMemoryUserRepository.items.push(user);
    const response = await sut.execute({
      userId: new UniqueEntityID('non-existing-id').toString(),
      email: user.email,
      name: user.name,
      password: user.password,
      phone: user.phone,
      addresses: [],
      userLoggedId: user.id.toString(),
    });
    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be allowed to update a user with an email that is already taken', async () => {
    const firstUser = makeUserFactory({
      name: 'Ada Lovelace',
      email: 'adalovelace@example.com',
    });
    const user = makeUserFactory({ name: 'John Doe' });

    inMemoryUserRepository.items.push(firstUser);
    inMemoryUserRepository.items.push(user);

    const response = await sut.execute({
      userId: user.id.toString(),
      email: 'adalovelace@example.com',
      name: user.name,
      password: user.password,
      phone: user.phone,
      addresses: [],
      userLoggedId: user.id.toString(),
    });
    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be allowed for a logged-in user to update another users account', async () => {
    const firstUser = makeUserFactory({ name: 'John Doe' });
    const secondUser = makeUserFactory({ name: 'Ada Lovelace' });
    inMemoryUserRepository.items.push(firstUser);
    inMemoryUserRepository.items.push(secondUser);
    const response = await sut.execute({
      email: firstUser.email,
      password: 'different-password',
      userId: firstUser.id.toString(),
      userLoggedId: secondUser.id.toString(),
    });
    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(NotAllowedError);
  });
});
