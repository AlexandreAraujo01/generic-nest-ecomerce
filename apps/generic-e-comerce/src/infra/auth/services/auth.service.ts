import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { UserRepository } from '@/domain/repositories/user-repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashEncoderDecoder } from '@/core/helpers/hashEncoder';

export interface AuthetificationSchema {
  sub: UniqueEntityID;
  username: string;
  role: string;
}

let payload: AuthetificationSchema;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserRepository,
    private jwtService: JwtService,
    private hashEncoderDecoder: HashEncoderDecoder,
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    const isValidPassword = await this.hashEncoderDecoder.compare(
      user.password,
      pass,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException();
    }
    payload = { sub: user.id, username: user.name, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
