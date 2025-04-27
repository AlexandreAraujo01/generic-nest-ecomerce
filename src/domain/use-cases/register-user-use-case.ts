import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { User } from '../entities/user';
import { UserRepository } from '../repositories/user-repository';
import { Either, left, right } from 'src/core/types/either';
import { UserAlreadyExists } from './errors/user-already-exists-error';
import { Address } from '../entities/address';
import { HashEncoderDecoder } from 'src/core/helpers/hashEncoder';
import { Injectable } from '@nestjs/common';

export type Role = 'USER' | 'ADMIN';
export interface registerUserUseCaseRequest {
  name: string;
  email: string;
  password: string;
  addresses: Address[];
  phone: string;
  role: Role;
  id?: UniqueEntityID;
}

export type registerUserUseCaseResponse = Either<UserAlreadyExists, User>;

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashEncoderDecoder: HashEncoderDecoder,
  ) {}

  async execute({
    name,
    email,
    addresses,
    password,
    phone,
    role,
    id,
  }: registerUserUseCaseRequest): Promise<registerUserUseCaseResponse> {
    const userAlreadyExists = await this.userRepository.findByEmail(email);
    if (userAlreadyExists) {
      return left(new UserAlreadyExists());
    }
    const hashedPassword = await this.hashEncoderDecoder.encode(password);
    const user = new User(
      { name, email, password: hashedPassword, phone, role, addresses },
      id,
    );
    await this.userRepository.create(user);
    return right(user);
  }
}
