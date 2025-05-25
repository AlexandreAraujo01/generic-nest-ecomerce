import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ProductRepository } from "../repositories/product-repository";
import { Either, left, right } from "@/core/types/either";
import { Product } from "../entities/products";
import { Injectable } from "@nestjs/common";
import { NotFoundError } from "./errors/not-found-error";


type GetProductByIdUseCaseResponse = Either<NotFoundError, Product>

@Injectable()
export class GetProductByIdUseCase {
    constructor(private productRepository: ProductRepository){}

    async execute(productId: string): Promise<GetProductByIdUseCaseResponse> {
        const product = await this.productRepository.findById(new UniqueEntityID(productId))
        if(!product){
            return left(new NotFoundError())
        }

        return right(product)
    }
}