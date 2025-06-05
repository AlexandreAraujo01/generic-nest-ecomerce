export class NotFoundError extends Error {
  constructor(message = 'Value not found') {
    super(message);
  }
}
