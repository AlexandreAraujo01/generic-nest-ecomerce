import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { UserAlreadyExists } from 'src/domain/use-cases/errors/user-already-exists-error';
import { RegisterUserUseCase } from 'src/domain/use-cases/register-user-use-case';
import { Public } from '@/infra/auth/public-route.decorator';
import { Role } from '@prisma/prisma';

const registerBodySchema = z.object({
  name: z.string(),
  email: z.string().email(), // <- precisa dos parênteses
  password: z.string(),
  phone: z.string().regex(/^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/, {
    message: 'Telefone inválido',
  }),
  role: z.enum(['USER', 'ADMIN']).default('USER'),
});

type RegisterBodySchema = z.infer<typeof registerBodySchema>;

@Controller('/accounts')
export class RegisterUserController {
  constructor(private registerUser: RegisterUserUseCase) {}
  @Public()
  @Post()
  @UsePipes(new ZodValidationPipe(registerBodySchema))
  async handle(@Body() body: RegisterBodySchema) {
    const { name, email, password, phone, role } = body;
    const result = await this.registerUser.execute({
      name,
      email,
      password,
      phone,
      role: Role[role],
      addresses: [],
    });

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case UserAlreadyExists:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
