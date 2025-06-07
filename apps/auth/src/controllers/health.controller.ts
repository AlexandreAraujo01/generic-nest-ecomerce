import { Public } from '@common/common/decorators/public.decorator';
import { Controller, Get } from '@nestjs/common';

@Controller('/health')
export class HealthController {
  @Public()
  @Get()
  healthCheck() {
    return { status: 'ok' };
  }
}