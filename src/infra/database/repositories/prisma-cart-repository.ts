import { CartRepository } from "@/domain/repositories/cart-repository";
import { PrismaService } from "../services/prisma-service";
import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Cart } from "@/domain/entities/cart";
import { CartItem } from "@/domain/entities/cartItem";
import { CartItemMapper } from "../mappers/prisma-cart-item-mapper";

@Injectable()
export class PrismaCartRepository implements CartRepository {
    constructor(private prisma: PrismaService){}

    async create(userId: UniqueEntityID, items?: CartItem[]): Promise<Cart | null> {
        const prismaItems = items?.map((item) => CartItemMapper.toPrisma(item))
        this.prisma.cart.create({data : })
    }
    delete(cartId: UniqueEntityID): void {
        throw new Error("Method not implemented.");
    }
    insertItems(items: CartItem[], cartId: UniqueEntityID): Promise<Cart | null> {
        throw new Error("Method not implemented.");
    }
    removeItems(items: CartItem[], cartId: UniqueEntityID): Promise<Cart | null> {
        throw new Error("Method not implemented.");
    }
    findById(cartId: UniqueEntityID): Promise<Cart | null> {
        throw new Error("Method not implemented.");
    }
    findByUserId(userId: UniqueEntityID): Promise<Cart | null> {
        throw new Error("Method not implemented.");
    }
    
}