import { CreateCartUseCase } from "@/domain/use-cases/create-cart-use-case";
import { BadRequestException, Body, ConflictException, Controller, HttpCode, NotFoundException, Post, UsePipes } from "@nestjs/common";
import { User } from "@/infra/decorators/user.decorator";
import { CartAlreadyExists } from "@/domain/use-cases/errors/cart-already-exists";
import { NotFoundError } from "@/domain/use-cases/errors/not-found-error";
import { UserRepository } from "@/domain/repositories/user-repository";
import { AuthetificationSchema } from "@auth/services/auth-service";

@Controller('/cart/create')
export class CreateCartController {
    constructor(private createCartUseCase: CreateCartUseCase){}

    @Post()
    @HttpCode(201)
    async handle(
        @User() user: AuthetificationSchema,
    ){  
        
        const { sub, username } = user
        const response = await this.createCartUseCase.execute({userId: sub.value, items: [], createdAt: new Date()})
        console.log(response,'cart response error?')
        if(response.isLeft()){
            const error = response.value
            switch(error.constructor){
                case CartAlreadyExists:
                    throw new ConflictException(error.message)
                case NotFoundError:
                    throw new NotFoundException(error.message)
                default:
                    throw new BadRequestException(error.message)
            }
        }

        return {cartId: response.value.id.value}
    }
}