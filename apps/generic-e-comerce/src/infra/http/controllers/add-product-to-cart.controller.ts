
import { User } from "@/infra/decorators/user.decorator";
import { BadRequestException, Body, Controller, HttpCode, NotFoundException, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { AddProductToCartUseCase } from "@/domain/use-cases/add-product-to-cart";
import { NotFoundError } from "@/domain/use-cases/errors/not-found-error";
import { AuthetificationSchema } from "@auth/services/auth-service";

const addProductToCartBodySchema = z.object({
    productId: z.string().uuid(),
    quantity: z.number().min(1)
})

type AddProductToCartBodySchema = z.infer<typeof addProductToCartBodySchema>

@Controller('/cart/add')
export class AddProductToCartController {
    constructor(private addProductToCartUseCase: AddProductToCartUseCase){}

    @HttpCode(204)
    @Post()
    async handle(
        @User() user: AuthetificationSchema,
        @Body(new ZodValidationPipe(addProductToCartBodySchema)) body: AddProductToCartBodySchema
    ){  
        const { sub } = user
        const {productId, quantity} = body
        const response = await this.addProductToCartUseCase.execute({productId, productQuantity: quantity, userId: sub.value})
        if(response.isLeft()){
            const error = response.value
            switch(error.constructor){
                case NotFoundError:
                    throw new NotFoundException(error.message)
                default:
                    throw new BadRequestException(error.message)
            }
        }
    
    return {}
    }
}