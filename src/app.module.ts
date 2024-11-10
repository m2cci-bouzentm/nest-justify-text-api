import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppService } from './app.service';
import { ApiController } from './api/api.controller';
import { ApiService } from './api/api.service';
import { JustifyTextService } from './justify-text/justify-text.service';
import { PrismaService } from './prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        name: 'limit',
        ttl: 1000,
        limit: 3,
      },
    ]),
    JwtModule.register({
      global: true,
      secretOrPrivateKey: process.env.SECRET,
      signOptions: { expiresIn: '30 days' },
    }),
  ],
  controllers: [AppController, ApiController],
  providers: [
    AppService,
    ApiService,
    JustifyTextService,
    PrismaService,
  ],
})
export class AppModule {}
