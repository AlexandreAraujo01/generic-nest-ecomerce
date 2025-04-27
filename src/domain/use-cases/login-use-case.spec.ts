import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';
import { makeUserFactory } from 'test/factories/make-user-factory';
import { FakeHashEncoderDecoder } from 'test/helpers/fake-hash-encoder';
import { LoginUseCase } from './login-use-case';
import { WrongCredentialsError } from './errors/wrong-credintials-error';

describe('Login user use case', () => {
  let inMemoryUserRepository: InMemoryUserRepository;
  let sut: LoginUseCase;
  let fakeHashEncodeDecode: FakeHashEncoderDecoder;
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    fakeHashEncodeDecode = new FakeHashEncoderDecoder();
    sut = new LoginUseCase(inMemoryUserRepository, fakeHashEncodeDecode);
  });

  it('should be able to login with right credentials', async () => {
    const user = makeUserFactory({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: await fakeHashEncodeDecode.encode('123456'),
    });

    inMemoryUserRepository.items.push(user);

    const response = await sut.execute({
      email: 'johndoe@example.com',
      rawPassword: '123456',
    });

    expect(response.isRight());
    expect(response.value).toEqual({
      user: expect.objectContaining({
        name: 'John Doe',
      }),
    });
  });

  it('should not be allowed to login with wrong email', async () => {
    const user = makeUserFactory({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });
    inMemoryUserRepository.items.push(user);

    const response = await sut.execute({
      email: 'adalovelace@example.com',
      rawPassword: '123456',
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(WrongCredentialsError);
  });

  it('should not be allowed to login with wrong password', async () => {
    const user = makeUserFactory({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });
    inMemoryUserRepository.items.push(user);

    const response = await sut.execute({
      email: 'johndoe@example.com',
      rawPassword: '654321',
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(WrongCredentialsError);
  });
});
