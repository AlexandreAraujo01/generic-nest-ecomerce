import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { HashEncoderDecoder } from '@/core/helpers/hashEncoder';
import { BcrypyEncoderDecoder } from '../../generic-e-comerce/src/infra/http/helpers/bcrypt-econder-decoder';
import { EnvModule } from '@/env/env.module';
import { EnvService } from '@/env/env.service';
import { DatabaseModule } from '@common/common/modules/database/database.module';
import { AuthService } from './services/auth-service';
import { AuthController } from './controllers/auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HealthController } from './controllers/health.controller';

@Module({
  imports: [
    EnvModule,
    DatabaseModule,
    JwtModule.registerAsync({
      global: true,
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (envService: EnvService) => ({
        secret: envService.get('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  providers: [
    {
      provide: HashEncoderDecoder,
      useClass: BcrypyEncoderDecoder,
    },
    AuthService,
  ],
  controllers: [AuthController,HealthController],
  exports: [AuthService],
})
export class AuthModule {}
