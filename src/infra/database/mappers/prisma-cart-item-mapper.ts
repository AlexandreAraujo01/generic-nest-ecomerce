import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { CartItem } from "@/domain/entities/cartItem";
import { Product } from "@/domain/entities/products";
import { CartItem as PrismaCartItem, Product as PrismaProduct } from "@prisma/prisma";
import { Prisma } from "@prisma/prisma";

interface PrismaCartItemWithProduct extends PrismaCartItem {
  product: PrismaProduct;
}



export class CartItemMapper {
    static toPrisma(cartItem: CartItem, cartId: UniqueEntityID): Prisma.CartItemUncheckedCreateInput {
        return {
            id: cartItem.id.toString(),
            cartId: cartId.toString(),
            productId: cartItem.item.id.toString(),
            quantity: cartItem.quantity
        }
    }


    static toDomain(prismaCartItem: PrismaCartItemWithProduct): CartItem {
        return new CartItem({
            quantity: prismaCartItem.quantity,
            item: new Product(prismaCartItem.product, new UniqueEntityID(prismaCartItem.productId))
        })
    }
}