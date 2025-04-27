import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { User } from 'src/domain/entities/user'
import { UserRepository } from 'src/domain/repositories/user-repository'

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  public items: User[] = []

  async create(user: User): Promise<void> {
    this.items.push(user)
  }

  async delete(userId: UniqueEntityID): Promise<void> {
    this.items = this.items.filter((user) => !user.id.equals(userId))
  }

  async findById(userId: UniqueEntityID): Promise<User | null> {
    const user = this.items.find((user) => user.id.equals(userId))
    if (!user) {
      return null
    }
    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((user) => user.email === email)
    if (!user) {
      return null
    }
    return user
  }

  async save(user: User): Promise<User> {
    const userIndex = this.items.findIndex((value) => value.id.equals(user.id))
    this.items[userIndex] = user
    return user
  }
}
