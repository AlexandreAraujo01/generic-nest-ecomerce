import { Prisma, Cart as PrismaCart, CartItem as PrismaCartItem, Product as PrismaProduct, } from "@prisma/prisma";
import { Cart } from "@/domain/entities/cart";
import { CartItemMapper } from "./prisma-cart-item-mapper";
import { CartItemWatchedList } from "@/core/entities/cart-items-watched-list";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface PrismaCartItemWithProduct extends PrismaCartItem {
  product: PrismaProduct;
}

interface PrismaCartWithCartItems extends PrismaCart{
  cartItems: PrismaCartItemWithProduct[];
}

interface PrismaCartAndRemovedAndAlteredItems {
    prismaCart: Prisma.CartUncheckedCreateInput,
    alteredItems:  PrismaCartItem[],
    removedItems:  PrismaCartItem[]
    newItems: PrismaCartItem[]
}

export class CartMapper {

    static toPrisma(cart: Cart): PrismaCartAndRemovedAndAlteredItems {

    const newItemsPrisma = cart.newItems

    const newItems = cart.newItems
        .map((item) => CartItemMapper.toPrismaOrNull(item, cart.id))
        .filter((item) => item !== null)

    const alteredItems = cart.alteredItems
        .map((item) => CartItemMapper.toPrismaOrNull(item, cart.id))
        .filter((item) => item !== null)


    const removedItems = cart.removedItems
        .map((item) => CartItemMapper.toPrismaOrNull(item, cart.id))
        .filter((item) => item !== null)


    return {
        prismaCart: {
            id: cart.id.toString(),
            userId: cart.userId.toString(),
            createdAt: cart.createdAt,
            updatedAt: cart.updatedAt,
            cartItems: {
                create: newItemsPrisma.map((item) =>
                    CartItemMapper.toPrismaWithoutCartId(item)
    )
            },
        },
        alteredItems,
        removedItems,
        newItems
    }
}



    static toDomain(prismaCart: PrismaCartWithCartItems): Cart {
        const domainCartItems = prismaCart.cartItems.map((item) => CartItemMapper.toDomain(item))
        return new Cart({
            userId: new UniqueEntityID(prismaCart.userId),
            items: new CartItemWatchedList(domainCartItems),
            createdAt: prismaCart.createdAt,
            updatedAt: prismaCart.updatedAt ?? undefined,
        }, new UniqueEntityID(prismaCart.id))
    }
}