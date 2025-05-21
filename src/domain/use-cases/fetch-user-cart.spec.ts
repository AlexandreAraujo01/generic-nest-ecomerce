import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCartRepository } from "test/repositories/in-memory-cart-repository";
import { makeUserFactory } from "test/factories/make-user-factory";
import { makeProductFactory } from "test/factories/make-product-factory";
import { makeCartFactory } from "test/factories/make-cart-factory";
import { CartItemWatchedList } from "@/core/entities/cart-items-watched-list";
import { CartItem } from "../entities/cartItem";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotFoundError } from "./errors/not-found-error";
import { FetchCartUseCase } from "./fetch-user-cart";

let cartRepository: InMemoryCartRepository
let sut: FetchCartUseCase

describe('fetch user cart', () => {
    beforeEach(() => {
        cartRepository = new InMemoryCartRepository()
        sut = new FetchCartUseCase(cartRepository)
    })

    it('Should be able to fetch cart from valid user', async () => {
        const user = makeUserFactory({name: 'John Doe'})
        const product = makeProductFactory({name: 'product-example'})
        const cartItem = new CartItem({item: product, quantity: 1})
        const itemsList = new CartItemWatchedList()
        itemsList.addItem(cartItem)
        const cart = makeCartFactory({userId: user.id, items: itemsList, createdAt: new Date()})
        await cartRepository.create(cart)
        const response = await sut.execute({userId: user.id})
        expect(response.isRight())
        if(response.isRight()){
            expect(response.value.currentItems[0].productName).toEqual('product-example')
        }
    })

    it('should not be able to fetch cart if user is invalid', async () => {
        const user = makeUserFactory({name: 'John Doe'})
        const product = makeProductFactory({name: 'product-example'})
        const cartItem = new CartItem({item: product, quantity: 1})
        const itemsList = new CartItemWatchedList()
        itemsList.addItem(cartItem)
        const cart = makeCartFactory({userId: user.id, items: itemsList, createdAt: new Date()})
        await cartRepository.create(cart)
        const response = await sut.execute({userId: new UniqueEntityID('faker-user-id')})
        expect(response.isLeft()).toBe(true)
        expect(response.value).toBeInstanceOf(NotFoundError)
    })
})