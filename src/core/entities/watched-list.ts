export abstract class WatchedList<T> {
  private newItemsList: T[];
  private initialItemsList: T[];
  private currentItemsList: T[];
  private removedItemsList: T[];
  constructor(private items: T[]) {
    this.currentItemsList = [...items];
    this.initialItemsList = [...items];
    this.newItemsList = [];
    this.removedItemsList = [];
  }

  public get currentItems() {
    return this.currentItemsList;
  }

  public get newItems() {
    return this.newItemsList;
  }

  public get removedItems() {
    return this.removedItemsList;
  }

  addItem(item: T) {
    const isItemAlreadyExists = this.currentItemsList.some((value) =>
      this.compare(value, item),
    );

    if (!isItemAlreadyExists) {
      this.currentItemsList.push(item);
    }

    const isItemRemoved = this.removedItemsList.find((value) =>
      this.compare(value, item),
    );

    if (isItemRemoved) {
      const removedIndexItem = this.removedItemsList.findIndex((value) =>
        this.compare(value, item),
      );
      this.removedItemsList.splice(removedIndexItem, 1);
    }

    const isItemAlreadyNew = this.newItemsList.find((value) =>
      this.compare(value, item),
    );

    const isItemInitial = this.initialItemsList.some((value) =>
      this.compare(value, item),
    );

    if (!isItemAlreadyNew && !isItemInitial) {
      this.newItemsList.push(item);
    }
  }

  removeItem(item: T) {
    const isItemRemoved = this.removedItemsList.some((value) =>
      this.compare(value, item),
    );

    const isItemInCurrent = this.currentItems.some((value) =>
      this.compare(value, item),
    );

    if (!isItemRemoved && isItemInCurrent) {
      this.removedItemsList.push(item);
    }

    const isItemInNew = this.newItems.some((value) =>
      this.compare(value, item),
    );

    if (isItemInNew) {
      const newItemIndex = this.newItemsList.findIndex((value) =>
        this.compare(value, item),
      );
      this.newItemsList.splice(newItemIndex, 1);
    }

    if (isItemInCurrent) {
      const currentItemIndex = this.currentItemsList.findIndex((value) =>
        this.compare(value, item),
      );
      this.currentItemsList.splice(currentItemIndex, 1);
    }
  }

  abstract compare(A: T, B: T): boolean;

  public hasChanges(): boolean {
    return (
      this.newItemsList.length > 0 ||
      this.removedItemsList.length > 0 ||
      this.currentItemsList.length !== this.initialItemsList.length
    );
  }
}
