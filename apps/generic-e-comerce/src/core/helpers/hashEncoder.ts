export abstract class HashEncoderDecoder {
  abstract encode(password: string): Promise<string>;
  abstract compare(salt: string, raw: string): Promise<boolean>;
}
