import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { DatabaseModule } from '../database/database.module';
import { AuthController } from './controllers/auth.controller';
import { HashEncoderDecoder } from 'src/core/helpers/hashEncoder';
import { BcrypyEncoderDecoder } from '../http/helpers/bcrypt-econder-decoder';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' },
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
