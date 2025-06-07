import { GetProductByIdUseCase } from "@/domain/use-cases/get-product-by-id";
import { BadRequestException, Body, Controller, HttpCode, NotFoundException, Post, ValidationPipe } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { NotFoundError } from "@/domain/use-cases/errors/not-found-error";
import { productPresenter } from "@common/common/modules/database/presenters/product.presenter";
import { Public } from "@common/common/decorators/public.decorator";


const getProductByIdControllerRequest = z.object({
    productId: z.string().uuid()
})

type GetProductByIdControllerRequest = z.infer<typeof getProductByIdControllerRequest>

@Controller('/product/details')
export class GetProductByIdController {
    constructor(private getProductByIdUseCase: GetProductByIdUseCase){}

    
    @Post()
    @Public()
    @HttpCode(200)
    async handle(@Body(new ZodValidationPipe(getProductByIdControllerRequest)) body: GetProductByIdControllerRequest){
        const { productId } = body
        const response = await this.getProductByIdUseCase.execute(productId)
        if(response.isLeft()){
            const error = response.value
            switch(error.constructor) {
                case NotFoundError:
                    throw new NotFoundException(error.message)
                default:
                    throw new BadRequestException()
            }
        }
        return productPresenter(response.value)
    }
}