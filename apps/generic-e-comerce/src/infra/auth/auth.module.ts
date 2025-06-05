import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '../database/database.module';
import { AuthController } from './controllers/auth.controller';
import { HashEncoderDecoder } from '@/core/helpers/hashEncoder';
import { BcrypyEncoderDecoder } from '../http/helpers/bcrypt-econder-decoder';
import { EnvModule } from '@/env/env.module';
import { EnvService } from '@/env/env.service';

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
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
