import { UpdateUserUseCase } from '@/domain/use-cases/update-user-use-case';
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  Post,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { User } from '@/infra/decorators/user.decorator'; // Aqui vem os dados do usuário
import { AuthetificationSchema } from '@/infra/auth/services/auth.service'; // Tipagem de dados do usuário
import { NotAllowedError } from '@/domain/use-cases/errors/not-allowed-error';
import { Address } from '@/domain/entities/address';

export const AddressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  number: z.string().min(1, 'Number is required'),
  zipCode: z.string().min(8, 'Invalid ZIP code'),
  neighborhood: z.string().min(1, 'Neighborhood is required'),
  state: z.string().length(2, 'State must be 2 letters'),
});

const updateUserControllerBodySchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  password: z.string().optional(),
  phone: z.string().optional(),
  address: z.array(AddressSchema).optional(),
});

export type UpdateUserControllerBodySchema = z.infer<
  typeof updateUserControllerBodySchema
>;

const bodyValidationPipe = new ZodValidationPipe(
  updateUserControllerBodySchema,
);

@Controller('/accounts/update')
export class UpdateUserController {
  constructor(private updateUserUseCase: UpdateUserUseCase) {}

  @HttpCode(204)
  @Post()
  async handle(
    @User() user: AuthetificationSchema,
    @Body(bodyValidationPipe) body: UpdateUserControllerBodySchema,
  ) {
    const { email, name, password, phone, userId, address } = body;
    const { sub } = user;
    const result = await this.updateUserUseCase.execute({
      email,
      userId,
      addresses: address ? address.map((value) => new Address(value)) : [],
      name,
      password,
      phone,
      userLoggedId: sub.value.toString(),
    });

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case NotAllowedError:
          throw new ForbiddenException(error.message);
        default:
          throw new BadRequestException();
      }
    }
  }
}
