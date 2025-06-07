import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { UserRepository } from '@/domain/repositories/user-repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashEncoderDecoder } from '@/core/helpers/hashEncoder';
import { Either, left, right } from '@/core/types/either';
import { NotFoundError } from '@/domain/use-cases/errors/not-found-error';

export interface AuthetificationSchema {
  sub: UniqueEntityID;
  username: string;
  email: string,
  role: string;
}

let payload: AuthetificationSchema;

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UserRepository,
    private jwtService: JwtService,
    private hashEncoderDecoder: HashEncoderDecoder,
  ) {}

  async signIn(email: string, pass: string): Promise<Either<NotFoundError ,{ access_token: string }>> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      return left(new NotFoundError());
    }
    const isValidPassword = await this.hashEncoderDecoder.compare(
      user.password,
      pass,
    );
    if (!isValidPassword) {
      return left(new NotFoundError());
    }
    payload = { sub: user.id, username: user.name, role: user.role, email: user.email };
    return right({
      access_token: await this.jwtService.signAsync(payload),
    })
  }
}
