import { Module } from '@nestjs/common';
import { PrismaService } from './services/prisma-service';
import { PrismaUserRepository } from './repositories/prisma-user-repository';
import { UserRepository } from 'src/domain/repositories/user-repository';
import { ProductRepository } from '@/domain/repositories/product-repository';
import { PrismaProductRepository } from './repositories/prisma-product-repository';

@Module({
  imports: [],
  controllers: [],
  providers: [
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: ProductRepository,
      useClass: PrismaProductRepository,
    },
  ],
  exports: [PrismaService, UserRepository, ProductRepository],
})
export class DatabaseModule {}
