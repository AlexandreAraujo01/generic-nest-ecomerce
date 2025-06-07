import { CartRepository } from "@/domain/repositories/cart-repository";
import { User } from "@/infra/decorators/user.decorator";
import { BadRequestException, Body, Controller, HttpCode, NotFoundException, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { RemoveProductFromCartUseCase } from "@/domain/use-cases/remove-product-from-cart-use-case";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotFoundError } from "@/domain/use-cases/errors/not-found-error";
import { AuthetificationSchema } from "@auth/services/auth-service";

const removeProductFromCartControllerRequest = z.object({
    productId: z.string().uuid(),
    quantity: z.coerce.number().min(1)
})

type RemoveProductFromCartControllerRequest = z.infer<typeof removeProductFromCartControllerRequest>

@Controller('/cart/remove')
export class RemoveProductFromCartController {
    constructor(private removeProductFromCartUseCase: RemoveProductFromCartUseCase){}

    @Post()
    @HttpCode(204)
    async handle(
        @User() user: AuthetificationSchema,
        @Body(new ZodValidationPipe(removeProductFromCartControllerRequest)) 
        body: RemoveProductFromCartControllerRequest,

){
            const {productId, quantity} = body
            const { sub } = user
            const response = await this.removeProductFromCartUseCase.execute({
                userId: sub.value, productId, productQuantity: quantity
            })
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