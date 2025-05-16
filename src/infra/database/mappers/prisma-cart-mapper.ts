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

export class CartMapper {

    static toPrisma(cart: Cart): Prisma.CartUncheckedCreateInput {
        return {
            id: cart.id.toString(),
            userId: cart.UserId.toString(),
            createdAt: cart.createdAt,
            updatedAt: cart.updatedAt
        }
    }


    static toDomain(prismaCart: PrismaCartWithCartItems): Cart {
        const domainCartItems = prismaCart.cartItems.map((item) => CartItemMapper.toDomain(item))
        return new Cart({
            userId: new UniqueEntityID(prismaCart.userId),
            items: new CartItemWatchedList(domainCartItems),
            createdAt: prismaCart.createdAt,
            updatedAt: prismaCart.updatedAt ?? undefined,
        })
    }
}