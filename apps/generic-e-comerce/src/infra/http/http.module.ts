import { RegisterUserUseCase } from '@/domain/use-cases/register-user-use-case';
import { Module } from '@nestjs/common';
import { RegisterUserController } from './controllers/register-user.controller';
import { HashEncoderDecoder } from '@/core/helpers/hashEncoder';
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
import { CreateCartController } from './controllers/create-cart.controller';
import { CreateCartUseCase } from '@/domain/use-cases/create-cart-use-case';
import { AddProductToCartController } from './controllers/add-product-to-cart.controller';
import { AddProductToCartUseCase } from '@/domain/use-cases/add-product-to-cart';
import { FetchCartUseCase } from '@/domain/use-cases/fetch-user-cart';
import { FetchUserCartItemsController } from './controllers/fetch-user-cart-items.controller';
import { RemoveProductFromCartUseCase } from '@/domain/use-cases/remove-product-from-cart-use-case';
import { RemoveProductFromCartController } from './controllers/remove-product-from-cart.controller';
import { GetProductByIdController } from './controllers/get-product-by-id.controller';
import { GetProductByIdUseCase } from '@/domain/use-cases/get-product-by-id';
import { DatabaseModule } from '@common/common/modules/database/database.module';
@Module({
  imports: [DatabaseModule],
  controllers: [
    RegisterUserController,
    FetchProductsByCategoryController,
    RegisterProductController,
    FetchProductsByNameController,
    UpdateUserController,
    UpdateProductController,
    CreateCartController,
    AddProductToCartController,
    FetchUserCartItemsController,
    RemoveProductFromCartController,
    GetProductByIdController,
  ],
  providers: [
    RegisterUserUseCase,
    ListProductsByCategoryUseCase,
    RegisterProductUseCase,
    ListProductsByNameUseCase,
    UpdateUserUseCase,
    UpdateProductUseCase,
    CreateCartUseCase,
    AddProductToCartUseCase,
    RemoveProductFromCartUseCase,
    FetchCartUseCase,
    GetProductByIdUseCase,
    {
      provide: HashEncoderDecoder,
      useClass: BcrypyEncoderDecoder,
    },
  ],

  exports: [
    RegisterUserUseCase,
    HashEncoderDecoder,
    ListProductsByCategoryUseCase,
    RegisterProductUseCase,
    ListProductsByNameUseCase,
    UpdateUserUseCase,
    UpdateProductUseCase,
    CreateCartUseCase,
    AddProductToCartUseCase,
  ],
})
export class HttpModule {}
