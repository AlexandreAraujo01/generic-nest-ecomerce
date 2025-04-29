import { UpdateProductUseCase } from '@/domain/use-cases/update-product-use-case';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { Roles } from '@/infra/auth/roles.decorator';
import { z } from 'zod';
import { NotFoundError } from 'rxjs';

const updateProductBodySchema = z.object({
  productId: z.string(),
  name: z.string().optional(),
  price: z.coerce.number().optional(),
  category: z.string().optional(),
  available: z.boolean().optional(),
});

export type UpdateProductBodySchema = z.infer<typeof updateProductBodySchema>;

const zodValidationBodySchema = new ZodValidationPipe(updateProductBodySchema);

@Controller('/update/product')
export class UpdateProductController {
  constructor(private updateProductUseCase: UpdateProductUseCase) {}

  @Post()
  @HttpCode(204)
  @Roles('ADMIN')
  @UsePipes(zodValidationBodySchema)
  async handle(@Body() body: UpdateProductBodySchema) {
    const { productId, available, category, name, price } = body;
    const response = await this.updateProductUseCase.execute({
      id: productId,
      name,
      available,
      category,
      price,
    });

    if (response.isLeft()) {
      const error = response.value;
      switch (error.constructor) {
        case NotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException();
      }
    }
  }
}
