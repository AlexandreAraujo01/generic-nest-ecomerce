import { CartItemWatchedList } from "@/core/entities/cart-items-watched-list";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Cart, CartProps } from "@/domain/entities/cart";
import { faker } from "@faker-js/faker";

export function makeCartFactory(cartProps: Partial<CartProps>, id?: UniqueEntityID): Cart {
    return new Cart({
        userId: new UniqueEntityID(faker.string.uuid()),
        items: new CartItemWatchedList(),
        createdAt: new Date(),
        ...cartProps
    }, id)
}