import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '@auth/services/auth-service';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { z } from 'zod';
import { Public } from '@common/common/decorators/public.decorator';

const credentialsBodySchema = z.object({
    email: z.string().email(),
    password: z.string()
})

export type CredentialsBodySchema = z.infer<typeof credentialsBodySchema>

// LOGIN
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  // @EventPattern('auth-request')
  // signIn(@Payload() data: CredentialsBodySchema) {
  //   const { email, password } = data;
  //   console.log(`received a new auth request - ${email}`)
  //   //return this.authService.signIn(email, password);
  // }
  
  @Public()
  @MessagePattern({cmd: 'auth-request'})
  signIn(@Payload() data: CredentialsBodySchema, @Ctx() context: RmqContext) {
    const { email, password } = data;
    return this.authService.signIn(email, password);
  }
}
