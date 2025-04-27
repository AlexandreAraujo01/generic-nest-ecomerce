import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvModule } from './env/env.module';
import { HttpModule } from './infra/http/http.module';
import { envSchema } from './env/env';
import { AppController } from './infra/app.controller';
import { DatabaseModule } from './infra/database/database.module';
import { AuthModule } from './infra/auth/auth.module';
import { AppService } from './infra/app.service';
import { AuthGuard } from './infra/auth/jwt-auth-guard';
import { APP_GUARD } from '@nestjs/core';
import { PrismaService } from './infra/database/services/prisma-service';
import { RolesGuard } from './infra/auth/roles-guard';

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
