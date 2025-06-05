import { Module } from '@nestjs/common';
import { PrismaService } from './services/prisma-service';
import { PrismaUserRepository } from './repositories/prisma-user-repository';
import { ProductRepository } from '@/domain/repositories/product-repository';
import { PrismaProductRepository } from './repositories/prisma-product-repository';
import { CartRepository } from '@/domain/repositories/cart-repository';
import { PrismaCartRepository } from './repositories/prisma-cart-repository';
import { CacheModule } from '../cache/cache.module';
import { UserRepository } from '@/domain/repositories/user-repository';

@Module({
  imports: [CacheModule],
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
    {
      provide: CartRepository,
      useClass: PrismaCartRepository
    },
  ],
  exports: [PrismaService, UserRepository, ProductRepository, CartRepository],
})
export class DatabaseModule {}
