import { CartRepository } from "@/domain/repositories/cart-repository";
import { PrismaService } from "../services/prisma-service";
import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Cart } from "@/domain/entities/cart";
import { CartItem } from "@/domain/entities/cartItem";
import { CartMapper } from "../mappers/prisma-cart-mapper";
@Injectable()
export class PrismaCartRepository implements CartRepository {
    constructor(private prisma: PrismaService){}

    async create(cart: Cart): Promise<Cart | null> {
        const cartAlreadyExists = await this.prisma.cart.findUnique({where: {userId: cart.userId.toString()}})
        if(cartAlreadyExists){
            return null
        }
        const response = await this.prisma.cart.create({data: CartMapper.toPrisma(cart).prismaCart, include: {
           cartItems: {
                include: {
                    product: true
                }
           } 
        }})
        return CartMapper.toDomain(response)
    }

    
    async delete(cartId: UniqueEntityID): Promise<void> {
        await this.prisma.cart.delete({
            where: {
                id: cartId.toString()
            },
            include: {
                cartItems: {
                    include: {
                        product: true
                    }
                }
            }
        })
    }


    async insertItems(cartDomain: Cart): Promise<Cart | null> {
        const cartExists = await this.prisma.cart.findUnique({
            where: {
                id: cartDomain.id.toString()
            }
        })

        if(!cartExists){
            return null
        }

        const {prismaCart, alteredItems, newItems} = CartMapper.toPrisma(cartDomain)

        await Promise.all(
                    newItems.map(item =>
                    this.prisma.cartItem.create({
                        data: {
                            cartId: cartDomain.id.toString(),
                            id: item.id,
                            productId: item.productId,
                            quantity: item.quantity,
                        }
                    })
                    )
                    )
        

                    
        await Promise.all(
            alteredItems.map(item =>
                this.prisma.cartItem.update({
                where: { id: item.id },
                data: {
                    cartId: item.cartId,
                    productId: item.productId,
                    quantity: item.quantity
                }
                })
            )
            )

        const idPrismaCart = prismaCart.id;
        delete prismaCart.id;

        
        const selectedCart = await this.prisma.cart.findUnique(
            {where: {id: idPrismaCart}, 
                    include: {
                        cartItems: {
                            include: {
                                product: true
                            }
                        }
                    }
            })

        if(!selectedCart){
            return null
        }
        return CartMapper.toDomain(selectedCart)
        
    }


    

    async removeItems(cart: Cart): Promise<Cart | null> {
        const cartExists = await this.prisma.cart.findUnique({
            where: {
                id: cart.id.toString()
            }
        })

        if(!cartExists){
            return null
        }

        const {prismaCart, removedItems} = CartMapper.toPrisma(cart)
        await Promise.all(
            removedItems.map(async (item) => {
                const productExist = await this.prisma.cartItem.findFirst({
                where: {
                    productId: item.productId,
                    cartId: item.cartId
                }
                });

                if (productExist) {
                const decrementedQuantity = productExist.quantity - item.quantity;

                if (decrementedQuantity <= 0) {
                    const x = await this.prisma.cartItem.delete({ where: { id: productExist.id } });
                } else {
                    await this.prisma.cartItem.update({
                    data: { quantity: decrementedQuantity },
                    where: { id: productExist.id }
                    });
                }
                }
            })
            );


        const idPrismaCart = prismaCart.id;

        const selectedCart = await this.prisma.cart.findUnique(
            {where: {id: idPrismaCart}, 
                    include: {
                        cartItems: {
                            include: {
                                product: true
                            }
                        }
                    }
            })

        if(!selectedCart){
            return null
        }

        return CartMapper.toDomain(selectedCart)
        
    }

    async findById(cartId: UniqueEntityID): Promise<Cart | null> {
        const cart = await this.prisma.cart.findUnique({where: {
            id: cartId.toString(),
        },
            include: {
                cartItems: {
                    include: {
                        product: true
                    }
                }
            }})
        if(!cart){
            return null
        }

        return CartMapper.toDomain(cart)
    }
    async findByUserId(userId: UniqueEntityID): Promise<Cart | null> {
        const cart = await this.prisma.cart.findUnique({where: {
            userId: userId.toString()
        },
            include: {
                cartItems: {
                    include: {
                        product: true
                    }
                }
            }})
        if(!cart){
            return null
        }

        return CartMapper.toDomain(cart)
    }

}
    