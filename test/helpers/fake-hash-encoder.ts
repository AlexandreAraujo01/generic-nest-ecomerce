import { HashEncoderDecoder } from 'src/core/helpers/hashEncoder';

export class FakeHashEncoderDecoder implements HashEncoderDecoder {
  async compare(salt: string, raw: string): Promise<boolean> {
    const rawHashed = `${raw}-encoded`;
    if (salt === rawHashed) {
      return true;
    }
    return false;
  }
  async encode(password: string): Promise<string> {
    const passwordHashed = `${password}-encoded`;
    return passwordHashed;
  }
}
