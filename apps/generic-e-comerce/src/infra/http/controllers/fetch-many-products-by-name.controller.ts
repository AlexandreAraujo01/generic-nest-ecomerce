import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { z } from 'zod';
import { Public } from '@/infra/auth/public-route.decorator';
import { ListProductsByNameUseCase } from '@/domain/use-cases/list-products-by-name';
import { productPresenter } from '@/infra/database/presenters/product.presenter';

export const fetchManyProductsByNameParamSchema = z.object({
  name: z.string(),
  page: z.coerce.number(),
});

export type FetchManyProductsByNameParamSchema = z.infer<
  typeof fetchManyProductsByNameParamSchema
>;

@Controller('/search/products')
export class FetchProductsByNameController {
  constructor(private listProductsByNameUseCase: ListProductsByNameUseCase) {}
  @HttpCode(200)
  @Get()
  @Public()
  @UsePipes(new ZodValidationPipe(fetchManyProductsByNameParamSchema))
  async handle(@Query() query: FetchManyProductsByNameParamSchema) {
    const { name, page } = query;
    const result = await this.listProductsByNameUseCase.execute({ name, page });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return {
      products: result.value.products.map((item) => productPresenter(item)),
    };
  }
}
