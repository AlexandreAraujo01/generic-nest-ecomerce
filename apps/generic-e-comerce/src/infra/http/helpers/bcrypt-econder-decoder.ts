import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcryptjs';
import { HashEncoderDecoder } from '@/core/helpers/hashEncoder';

@Injectable()
export class BcrypyEncoderDecoder implements HashEncoderDecoder {
  async encode(password: string): Promise<string> {
    const hashedPassword = await hash(password, 8);
    return hashedPassword;
  }
  async compare(salt: string, raw: string): Promise<boolean> {
    const result = await compare(raw, salt);
    return result;
  }
}
