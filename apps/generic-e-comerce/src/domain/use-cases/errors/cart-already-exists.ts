export class CartAlreadyExists extends Error {
  constructor() {
    super('Cart already exists for this user');
  }
}
