import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Query,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';
import { Public } from '@/infra/auth/public-route.decorator';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { ListProductsByCategoryUseCase } from '@/domain/use-cases/list-products-by-category';
import { productPresenter } from '@/infra/database/presenters/product.presenter';

const fetchProductsQuerySchema = z.object({
  category: z.string(),
  page: z.coerce.number(),
});

type FetchProductsQuerySchema = z.infer<typeof fetchProductsQuerySchema>;

@Controller('/search/products/category')
export class FetchProductsByCategoryController {
  constructor(
    private fetchProductsByCategoryUseCase: ListProductsByCategoryUseCase,
  ) {}
  @Public()
  @HttpCode(200)
  @Get()
  @UsePipes(new ZodValidationPipe(fetchProductsQuerySchema))
  async handle(@Query() query: FetchProductsQuerySchema) {
    const { category, page } = query;
    const result = await this.fetchProductsByCategoryUseCase.execute({
      category,
      page,
    });
    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return {
      products: result.value.products.map((item) => productPresenter(item)),
    };
  }
}
