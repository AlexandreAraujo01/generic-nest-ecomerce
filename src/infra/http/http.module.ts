import { RegisterUserUseCase } from 'src/domain/use-cases/register-user-use-case';
import { DatabaseModule } from '../database/database.module';
import { Module } from '@nestjs/common';
import { RegisterUserController } from './controllers/register-user.controller';
import { HashEncoderDecoder } from 'src/core/helpers/hashEncoder';
import { BcrypyEncoderDecoder } from './helpers/bcrypt-econder-decoder';
import { FetchProductsByCategoryController } from './controllers/fetch-many-products-by-category.controller';
import { ListProductsByCategoryUseCase } from '@/domain/use-cases/list-products-by-category';
import { RegisterProductController } from './controllers/register-product.controller';
import { RegisterProductUseCase } from '@/domain/use-cases/register-product-use-case';
import { ListProductsByNameUseCase } from '@/domain/use-cases/list-products-by-name';
import { FetchProductsByNameController } from './controllers/fetch-many-products-by-name.controller';
import { UpdateUserController } from './controllers/update-user.controller';
import { UpdateUserUseCase } from '@/domain/use-cases/update-user-use-case';
import { UpdateProductController } from './controllers/update-product.controller';
import { UpdateProductUseCase } from '@/domain/use-cases/update-product-use-case';
@Module({
  imports: [DatabaseModule],
  controllers: [
    RegisterUserController,
    FetchProductsByCategoryController,
    RegisterProductController,
    FetchProductsByNameController,
    UpdateUserController,
    UpdateProductController,
  ],
  providers: [
    RegisterUserUseCase,
    ListProductsByCategoryUseCase,
    RegisterProductUseCase,
    ListProductsByNameUseCase,
    UpdateUserUseCase,
    {
      provide: HashEncoderDecoder,
      useClass: BcrypyEncoderDecoder,
    },
    UpdateProductUseCase,
  ],

  exports: [
    RegisterUserUseCase,
    HashEncoderDecoder,
    ListProductsByCategoryUseCase,
    RegisterProductUseCase,
    ListProductsByNameUseCase,
    UpdateUserUseCase,
    UpdateProductUseCase,
  ],
})
export class HttpModule {}
