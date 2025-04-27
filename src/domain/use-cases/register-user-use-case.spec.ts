import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterUserUseCase } from './register-user-use-case'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'
import { makeUserFactory } from 'test/factories/make-user-factory'
import { UserAlreadyExists } from './errors/user-already-exists-error'
import { FakeHashEncoderDecoder } from 'test/helpers/fake-hash-encoder'

describe('Register user use case', () => {
  let inMemoryUserRepository: InMemoryUserRepository
  let sut: RegisterUserUseCase
  let fakeHashEncodeDecode: FakeHashEncoderDecoder
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    fakeHashEncodeDecode = new FakeHashEncoderDecoder()
    sut = new RegisterUserUseCase(inMemoryUserRepository, fakeHashEncodeDecode)
  })

  it('should be able to register an user', async () => {
    const response = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      phone: '988889999',
      role: 'USER',
      addresses: [],
    })

    expect(response.isRight()).toBe(true)
    expect(inMemoryUserRepository.items).toHaveLength(1)
    expect(inMemoryUserRepository.items[0]).toEqual(
      expect.objectContaining({ name: 'John Doe' }),
    )
  })

  it('should not be allowed to register an existing user', async () => {
    const user = makeUserFactory({ email: 'johndoe@example.com' })
    inMemoryUserRepository.items.push(user)

    const response = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      phone: '988889999',
      role: 'USER',
      addresses: [],
    })

    expect(response.isLeft()).toBe(true)
    expect(inMemoryUserRepository.items).toHaveLength(1)
    expect(response.value).toBeInstanceOf(UserAlreadyExists)
  })

  it('should be able to encode user password upon registration', async () => {
    const response = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      phone: '988889999',
      role: 'USER',
      addresses: [],
    })

    expect(response.isRight()).toBe(true)
    expect(inMemoryUserRepository.items[0].password).toEqual('123456-encoded')
  })
})
