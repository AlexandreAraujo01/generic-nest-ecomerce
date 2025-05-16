import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { User } from 'src/domain/entities/user';
import { UserRepository } from 'src/domain/repositories/user-repository';
import { PrismaService } from '../services/prisma-service';
import { PrismaUserMapper } from '../mappers/prisma-user-mapper';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<void> {
    const prismaUser = PrismaUserMapper.ToPrisma(user);
    await this.prisma.user.create({ data: prismaUser });
  }

  async delete(userId: UniqueEntityID): Promise<void> {

    await this.prisma.user.delete({
      where: {
        id: userId.toString(),
      },
    });
  }

  async findById(userId: UniqueEntityID): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: {
        id: userId.toString(),
      },
    });
    if (!prismaUser) {
      return null;
    }
    return PrismaUserMapper.toDomain(prismaUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!prismaUser) {
      return null;
    }
    return PrismaUserMapper.toDomain(prismaUser);
  }

  async save(user: User): Promise<User> {
    const userUpdated = await this.prisma.user.update({
      where: {
        id: user.id.toString(),
      },
      data: PrismaUserMapper.ToPrisma(user),
    });
    return PrismaUserMapper.toDomain(userUpdated);
  }
}
