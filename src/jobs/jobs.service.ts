import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  // Schedule a task to run every day at 00:00
  @Cron('0 0 * * *', {
    timeZone: 'Europe/Paris',
  })
  async resetDailyWordsLimit() {
    try {
      await this.prisma.user.updateMany({
        data: {
          justifiedWords: 0,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to reset daily words limit');
    }
    console.log('Reseting users daily rate limit ...');
  }
}
