import { Cart } from "@/domain/entities/cart";

export function cartPresenter(cart: Cart) {
    const items = cart.currentItems.map((cartItem) => {
        return {
            name: cartItem.productName,
            price: cartItem.productPrice,
            quantity: cartItem.quantity,
            category: cartItem.productCategory,
            disponibility: cartItem.productDisponibility,
        }
    })

    return items
}