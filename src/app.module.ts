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
import { JobsService } from './jobs/jobs.service';
import { ScheduleModule } from '@nestjs/schedule';

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
      secret: process.env.SECRET,
      signOptions: { expiresIn: '30 days' },
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController, ApiController],
  providers: [
    AppService,
    ApiService,
    JustifyTextService,
    PrismaService,
    JobsService,
  ],
})
export class AppModule {}
