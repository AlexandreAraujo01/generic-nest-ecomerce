import { User } from '../entities/user';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';

export abstract class UserRepository {
  abstract create(user: User): Promise<void>;

  abstract delete(userId: UniqueEntityID): Promise<void>;

  abstract findById(userId: UniqueEntityID): Promise<User | null>;

  abstract findByEmail(email: string): Promise<User | null>;

  abstract save(user: User): Promise<User>;
}
