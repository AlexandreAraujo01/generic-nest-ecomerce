import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { CartRepository } from "../repositories/cart-repository";
import { Either, left, right } from "@/core/types/either";
import { NotFoundError } from "./errors/not-found-error";
import { Cart } from "../entities/cart";
import { Injectable } from "@nestjs/common";



interface  FetchCartUseCaeRequest {
    userId: UniqueEntityID
}

type FetchCartUseCaeResponse = Either<NotFoundError, Cart>

@Injectable()
export class FetchCartUseCase  {
    constructor(private cartRepository: CartRepository){}

    async execute({ userId }: FetchCartUseCaeRequest): Promise<FetchCartUseCaeResponse> {
        const cart = await this.cartRepository.findByUserId(userId)
        if(!cart){
            return left(new NotFoundError('Cart not found'))
        }

        return right(cart)
    }
}