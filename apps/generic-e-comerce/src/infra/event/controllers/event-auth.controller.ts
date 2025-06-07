import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { z } from "zod";
import { EventAuthService } from "../services/event-auth.service";
import { Public } from "@common/common/decorators/public.decorator";
import { firstValueFrom } from 'rxjs';

const credentialsBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type CredentialsBodySchema = z.infer<typeof credentialsBodySchema>;

@Controller('/sessions')
export class EventAuthController {
  constructor(private authService: EventAuthService) {}

  @Post()
  @Public()
  async handle(
    @Body(new ZodValidationPipe(credentialsBodySchema))
    credentials: CredentialsBodySchema,
  ) {
    const res = await firstValueFrom(this.authService.execute(credentials));

    if (!res.value?.access_token) {
      throw new UnauthorizedException();
    }

    return { access_token: res.value.access_token };
  }
}
