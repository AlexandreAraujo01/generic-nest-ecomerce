import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Public } from '../public-route.decorator';

export interface LoginBodySchema {
  email: string;
  password: string;
}

// LOGIN
@Controller('/sessions')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post()
  signIn(@Body() body: LoginBodySchema) {
    const { email, password } = body;
    return this.authService.signIn(email, password);
  }
}
