import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { User, UserProps } from 'src/domain/entities/user';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { hashSync } from 'bcryptjs';
import { PrismaService } from '@/infra/database/services/prisma-service';
import { PrismaUserMapper } from '@/infra/database/mappers/prisma-user-mapper';
import { AddressesWatchedList } from '@/domain/entities/address-watched-list';
export function makeUserFactory(
  props: Partial<UserProps>,
  id?: UniqueEntityID,
) {
  const user = new User(
    {
      ...{
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        phone: faker.phone.number(),
        addresses: new AddressesWatchedList([]),
        role: 'USER',
      },
      ...props, // props por último, para sobrescrever os valores acima
    },
    id,
  );

  return user;
}

@Injectable()
export class MakeUserFactoryPrisma {
  constructor(private prisma: PrismaService) {}

  async makePrismaUser(props: Partial<UserProps>, id?: string) {
    const user = makeUserFactory(props, new UniqueEntityID(id));
    user.password = hashSync(user.password, 6);
    await this.prisma.user.create({
      data: PrismaUserMapper.ToPrisma(user),
    });
  }
}
