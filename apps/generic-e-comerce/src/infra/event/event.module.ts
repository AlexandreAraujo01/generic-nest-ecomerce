// auth-client.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventAuthService } from './services/event-auth.service';
import { EventAuthController } from './controllers/event-auth.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'auth_queue',
        },
      },
    ]),
  ],
  controllers: [EventAuthController],
  providers: [EventAuthService],
  exports: [ClientsModule, EventAuthService],
})
export class AuthClientModule {}
