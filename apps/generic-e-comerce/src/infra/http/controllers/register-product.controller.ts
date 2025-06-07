import { RegisterProductUseCase } from '@/domain/use-cases/register-product-use-case';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { ProductAlreadyExistsError } from '@/domain/use-cases/errors/product-already-exists-error';
import { productPresenter } from '@common/common/modules/database/presenters/product.presenter';
import { Roles } from '@common/common/decorators/roles.decorator';

export const registerProductBodySchema = z.object({
  name: z.string(),
  price: z.coerce.number(),
  category: z.string(),
  available: z.boolean(),
});

export type RegisterProductBodySchema = z.infer<
  typeof registerProductBodySchema
>;

@Controller('/product/register')
export class RegisterProductController {
  constructor(private registerProductUseCase: RegisterProductUseCase) {}
  @Post()
  @HttpCode(201)
  @Roles('ADMIN')
  @UsePipes(new ZodValidationPipe(registerProductBodySchema))
  async handle(@Body() body: RegisterProductBodySchema) {
    const { name, price, available, category } = body;
    const result = await this.registerProductUseCase.execute({
      name,
      price,
      available,
      category,
    });
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case ProductAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException();
      }
    }

    return { product: productPresenter(result.value.product) };
  }
}
