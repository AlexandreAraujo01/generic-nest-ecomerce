import { AddressesWatchedList } from '@/domain/entities/address-watched-list';
import { Prisma, Role } from 'prisma/generated/prisma';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { User } from 'src/domain/entities/user';

export class PrismaUserMapper {
  static ToPrisma(user: User): Prisma.UserUncheckedCreateInput {
    const prismaUser = {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      phone: user.phone,
      role: user.role as Role,
    };

    return prismaUser;
  }

  static toDomain(user: Prisma.UserUncheckedCreateInput): User {
    const domainUser = new User(
      {
        email: user.email,
        name: user.name,
        password: user.password,
        phone: user.phone,
        addresses: new AddressesWatchedList([]),
        role: user.role ?? 'USER',
      },
      new UniqueEntityID(user.id),
    );
    return domainUser;
  }
}
