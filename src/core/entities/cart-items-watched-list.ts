import { CartItem } from '@/domain/entities/cartItem';

export class CartItemWatchedList {
  private newItemsList: CartItem[] = [];
  private initialItemsList: CartItem[];
  private currentItemsList: CartItem[];
  private alteredItemsList: CartItem[] = [];
  private removedItemsList: CartItem[] = [];

  constructor(items: CartItem[] = []) {
    this.initialItemsList = items.map((item) => item.clone());
    this.currentItemsList = items.map((item) => item.clone());
  }

  public get currentItems() {
    return this.currentItemsList;
  }

  public get newItems() {
    return this.newItemsList;
  }

  public get alteredItems() {
    return this.alteredItemsList;
  }

  public get removedItems() {
    return this.removedItemsList;
  }

  public get initialItems() {
    return this.initialItemsList;
  }

  addItem(item: CartItem) {
    const currentIndex = this.currentItemsList.findIndex((value) =>
      this.compare(value, item),
    );

    if (currentIndex === -1) {
      this.currentItemsList.push(item.clone());
    } else {
      this.currentItemsList[currentIndex].quantity += item.quantity;
    }

    const removedIndex = this.removedItemsList.findIndex((value) =>
      this.compare(value, item),
    );
    if (removedIndex !== -1) {
      this.removedItemsList.splice(removedIndex, 1);
    }

    const initiallyExisted = this.initialItemsList.some((value) =>
      this.compare(value, item),
    );
    const newIndex = this.newItemsList.findIndex((value) =>
      this.compare(value, item),
    );

    if (!initiallyExisted && newIndex === -1) {
      this.newItemsList.push(item.clone());
    } else if (initiallyExisted) {
      const original = this.initialItemsList.find((value) =>
        this.compare(value, item),
      );
      const current = this.currentItemsList.find((value) =>
        this.compare(value, item),
      );

      if (original && current && original.quantity !== current.quantity) {
        const altered = current.clone();
        this.updateOrAddAlteredItem(altered);
      }
    } else if (newIndex !== -1) {
      this.newItemsList[newIndex].quantity += item.quantity;
    }
  }

  removeItem(item: CartItem) {
    const currentIndex = this.currentItemsList.findIndex((value) =>
      this.compare(value, item),
    );

    const removedIndex = this.removedItemsList.findIndex((value) =>
      this.compare(value, item),
    );

    if (removedIndex === -1) {
      this.removedItemsList.push(item.clone());
    }

    const currentItem = this.currentItems.find((value) =>
      this.compare(value, item),
    );

    if (currentItem && currentItem?.quantity - item.quantity >= 1) {
      this.currentItemsList[currentIndex].quantity -= item.quantity;
    }
    if (currentItem && currentItem?.quantity - item.quantity < 1) {
      this.currentItemsList.splice(currentIndex, 1);
    }

    const alteredIndex = this.alteredItems.findIndex((value) =>
      this.compare(value, item),
    );

    const alteredItem = this.alteredItems.find((value) =>
      this.compare(value, item),
    );

    if (alteredItem && alteredItem.quantity - item.quantity >= 1) {
      this.alteredItemsList[alteredIndex].quantity -= item.quantity;
    } else if (alteredItem && alteredItem.quantity - item.quantity < 1) {
      this.alteredItemsList.splice(alteredIndex, 1);
    }

    const newIndex = this.newItemsList.findIndex((value) =>
      this.compare(value, item),
    );

    const newItem = this.newItemsList.find((value) =>
      this.compare(value, item),
    );

    if (newItem && newItem.quantity - item.quantity >= 1) {
      this.newItemsList[newIndex].quantity -= item.quantity;
    } else if (newItem && newItem.quantity - item.quantity < 1) {
      this.removedItemsList.splice(newIndex, 1);
    }
  }

  private updateOrAddAlteredItem(item: CartItem) {
    const index = this.alteredItemsList.findIndex((value) =>
      this.compare(value, item),
    );
    if (index === -1) {
      this.alteredItemsList.push(item);
    } else {
      this.alteredItemsList[index] = item;
    }
  }

  private compare(A: CartItem, B: CartItem): boolean {
    return A.productId === B.productId;
  }

  public hasChanges(): boolean {
    return (
      this.newItemsList.length > 0 ||
      this.removedItemsList.length > 0 ||
      this.alteredItemsList.length > 0
    );
  }
}
