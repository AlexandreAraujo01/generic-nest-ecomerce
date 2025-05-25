import { beforeEach, describe, expect, it } from "vitest";
import { GetProductByIdUseCase } from "./get-product-by-id";
import { InMemoryProductRepository } from "test/repositories/in-memory-product-repository";
import { makeProductFactory } from "test/factories/make-product-factory";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotFoundError } from "./errors/not-found-error";

let sut: GetProductByIdUseCase
let productRepository: InMemoryProductRepository
describe('Get product by id use case', () => {
    beforeEach(() => {
        productRepository = new InMemoryProductRepository()
        sut = new GetProductByIdUseCase(productRepository)
    })

    it('should be able to get product by id', async () => {
        const product = makeProductFactory({name: 'example product'})
        await productRepository.create(product)

        const response = await sut.execute(product.id.toString())
        expect(response.isRight()).toBe(true)
        expect(response.value?.name).toEqual('example product')
    })

    it('should not be allowed to get product with wrong id', async () => {
        const product = makeProductFactory({name: 'example product'})
        await productRepository.create(product)

        const response = await sut.execute(new UniqueEntityID('fake-id').toString())
        expect(response.isLeft()).toBe(true)
        expect(response.value).toBeInstanceOf(NotFoundError)
    })

})