import { UpdateUserUseCase } from '@/domain/use-cases/update-user-use-case';
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { User } from '@/infra/decorators/user.decorator';
import { AuthetificationSchema } from '@/infra/auth/services/auth.service';
import { Address } from '@/domain/entities/address';
import { NotAllowedError } from '@/domain/use-cases/errors/not-allowed-error';

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
  address: z.array(AddressSchema),
});

export type UpdateUserControllerBodySchema = z.infer<
  typeof updateUserControllerBodySchema
>;

@Controller('/user/update')
export class UpdateUserController {
  constructor(private updateUserUseCase: UpdateUserUseCase) {}
  @HttpCode(204)
  @Post()
  @UsePipes(new ZodValidationPipe(updateUserControllerBodySchema))
  async handle(
    @Body() body: UpdateUserControllerBodySchema,
    @User() user: AuthetificationSchema,
  ) {
    const { email, name, password, phone, userId, address } = body;
    const { sub } = user;
    const result = await this.updateUserUseCase.execute({
      email,
      userId,
      addresses: address.map((value) => new Address(value)),
      name,
      password,
      phone,
      userLoggedId: sub.toString(),
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
