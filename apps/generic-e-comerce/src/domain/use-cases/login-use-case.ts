import { HashEncoderDecoder } from '@/core/helpers/hashEncoder';
import { UserRepository } from '../repositories/user-repository';
import { Either, left, right } from '@/core/types/either';
import { WrongCredentialsError } from './errors/wrong-credintials-error';
import { User } from '../entities/user';
import { Injectable } from '@nestjs/common';

export interface LoginUseCaseRequest {
  email: string;
  rawPassword: string;
}

type rightUserResponse = { user: User };

export type LoginUseCaseResponse = Either<
  WrongCredentialsError,
  rightUserResponse
>;

@Injectable()
export class LoginUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashEncodeDecode: HashEncoderDecoder,
  ) {}

  async execute({
    email,
    rawPassword,
  }: LoginUseCaseRequest): Promise<LoginUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return left(new WrongCredentialsError());
    }
    const passwordHashed = await this.hashEncodeDecode.encode(rawPassword);
    if (user.password !== passwordHashed) {
      return left(new WrongCredentialsError());
    }

    return right({ user });
  }
}
