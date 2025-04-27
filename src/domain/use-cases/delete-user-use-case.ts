import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { UserRepository } from '../repositories/user-repository';
import { Either, left, right } from 'src/core/types/either';
import { User } from '../entities/user';
import { NotAllowedError } from './errors/not-allowed-error';

export interface DeleteUserUseCaseRequest {
  id: UniqueEntityID;
}

export type DeleteUserUseCaseResponse = Either<NotAllowedError, User>;
export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ id }: DeleteUserUseCaseRequest) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return left(new NotAllowedError());
    }
    await this.userRepository.delete(id);
    return right(user);
  }
}
