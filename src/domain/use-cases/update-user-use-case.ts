import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { UserRepository } from '../repositories/user-repository';
import { NotAllowedError } from './errors/not-allowed-error';
import { Either, left, right } from 'src/core/types/either';
import { User } from '../entities/user';
import { Injectable } from '@nestjs/common';
import { HashEncoderDecoder } from '@/core/helpers/hashEncoder';
import { Address } from '../entities/address';

export interface UpdateUserUseCaseRequest {
  userId: string;
  name?: string;
  email: string;
  password?: string;
  addresses?: Address[];
  phone?: string;
  userLoggedId: string;
}

export type UpdateUserUseCaseResponse = Either<NotAllowedError, User>;

@Injectable()
export class UpdateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashEncoder: HashEncoderDecoder,
  ) {}

  async execute({
    name,
    email,
    addresses,
    password,
    phone,
    userId,
    userLoggedId,
  }: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
    const user = await this.userRepository.findById(new UniqueEntityID(userId));
    const loggedUser = await this.userRepository.findById(
      new UniqueEntityID(userLoggedId),
    );
    const userWithSameEmail = await this.userRepository.findByEmail(email);
    if (!user || !loggedUser) {
      return left(new NotAllowedError());
    }
    const isUserAdmin = loggedUser.role === 'ADMIN' ? true : false;
    const isTheSameUser = userLoggedId === user.id.toString() ? true : false;
    if (!isUserAdmin && !isTheSameUser) {
      return left(new NotAllowedError());
    }
    if (userWithSameEmail && userWithSameEmail.id.toString() !== userId) {
      return left(new NotAllowedError());
    }

    if (email) {
      user.email = email;
    }
    if (name) {
      user.name = name;
    }
    if (addresses) {
      addresses.map((address) => user.addresses.addItem(address));
    }
    if (password) {
      user.password = await this.hashEncoder.encode(password);
    }
    if (phone) {
      user.phone = phone;
    }

    const updatedUser = await this.userRepository.save(user);
    return right(updatedUser);
  }
}
