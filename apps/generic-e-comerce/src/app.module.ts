import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvModule } from './env/env.module';
import { HttpModule } from './infra/http/http.module';
import { envSchema } from './env/env';
import { AppController } from './infra/app.controller';
import { AuthModule } from '../../auth/src/auth.module';
import { AppService } from './infra/app.service';
import { APP_GUARD } from '@nestjs/core';
import { PrismaService } from '@common/common/modules/database/services/prisma-service';
import { DatabaseModule } from '@common/common/modules/database/database.module';
import { AuthGuard } from '@auth/guards/auth.guard';
import { RolesGuard } from '@common/common/guards/roles-guard';
import { AuthClientModule } from './infra/event/event.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    HttpModule,
    EnvModule,
    AuthClientModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AppService,
    PrismaService,
  ],
})
export class AppModule {}
