import { BadRequestException, Body, ConflictException, Controller, Get, HttpCode, NotFoundException, Post, UsePipes } from "@nestjs/common";
import { User } from "@/infra/decorators/user.decorator";
import { CartAlreadyExists } from "@/domain/use-cases/errors/cart-already-exists";
import { NotFoundError } from "@/domain/use-cases/errors/not-found-error";
import { FetchCartUseCase } from "@/domain/use-cases/fetch-user-cart";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { cartPresenter } from "@common/common/modules/database/presenters/cart.presenter";
import { AuthetificationSchema } from "apps/auth/src/services/auth-service";

@Controller('/cart/list')
export class FetchUserCartItemsController {
    constructor(private fetchCartUseCase : FetchCartUseCase){}

    @Get()
    @HttpCode(200)
    async handle(
        @User() user: AuthetificationSchema,
    ){  
        
        const { sub, username } = user
        const response = await this.fetchCartUseCase.execute({userId: new UniqueEntityID(sub.value)})
        if(response.isLeft()){
            const error = response.value
            switch(error.constructor){
                case NotFoundError:
                    throw new NotFoundException(error.message)
                default:
                    throw new BadRequestException(error.message)
            }
        }

        return {products: cartPresenter(response.value)}
    }
}