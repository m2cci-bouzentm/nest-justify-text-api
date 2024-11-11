import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { JustifyTextService } from '../justify-text/justify-text.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApiService {
  private readonly MAX_DAILY_WORDS: number = Number(
    process.env.MAX_DAILY_WORDS,
  );
  private readonly TEXT_LINE_LENGTH: number = Number(
    process.env.TEXT_LINE_LENGTH,
  );

  constructor(
    private justifyTextService: JustifyTextService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async justifyText(text: string, token: string): Promise<string> {
    const words: string[] = text.split(' ');

    // get the user's email if he included the token in the request
    const userEmail: string = await this.getUserEmailFromToken(token);

    const user: User = await this.getUserByEmail(userEmail);

    if (user.justifiedWords + words.length < this.MAX_DAILY_WORDS) {
      await this.updateJustifiedWords(user, words.length);       
      return this.justifyTextService.fullJustify(words, this.TEXT_LINE_LENGTH).join('\n');
    }

    // if user has exceded the daily allowed limit
    throw new HttpException(
      'Surpassed Daily limit. Payment required.',
      HttpStatus.PAYMENT_REQUIRED,
    );
  }

  async registreUser(email: string): Promise<string> {
    let user: User;

    if (!email) {
      throw new BadRequestException('Email is required');
    }

    if (await this.isRegistred(email)) {
      user = await this.getUserByEmail(email);
      return user.token;
    }

    // registre if a new user
    try {
      user = await this.prisma.user.create({
        data: {
          email,
          token: await this.jwtService.signAsync({ email }),
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to register user');
    }

    return user.token;
  }

  private async getUserEmailFromToken(token: string): Promise<string> {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      return decoded.email;
    } catch (error) {
      throw new UnauthorizedException(
        'You need to register using an email at /api/token before justifying any text or include your token in the authorization header if already registered.',
      );
    }
  }

  private async updateJustifiedWords(
    user: User,
    wordCount: number,
  ): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { justifiedWords: user.justifiedWords + wordCount },
      });
    } catch (error) {
      throw new BadRequestException('Failed update justified words count.');
    }
  }

  private async isRegistred(email: string): Promise<boolean> {
    const user = await this.getUserByEmail(email);
    return user !== null && typeof user !== 'undefined';
  }

  private async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      return user;
    } catch (error) {
      throw new BadRequestException('Failed to get user.');
    }
  }
}
