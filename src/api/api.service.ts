import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { JustifyTextService } from 'src/justify-text/justify-text.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ApiService {
  constructor(
    private justifyTextService: JustifyTextService,
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  justifyText(text: string): string {
    return this.justifyTextService.fullJustify(text.split(' '), 80).join(' ');
  }

  async registreUser(email: string): Promise<string> {
    // get the user if already registred
    let user: User;
    if (await this.isRegistred(email)) {
      user = await this.getUserByEmail(email);
      return  user.token;
    }

    try {
      user = await this.prisma.user.create({
        data: {
          email,
          token: await this.jwtService.signAsync({ email }),
        },
      });
    } catch (error) {
      console.log(error);
    }

    return user.token;
  }

  async isRegistred(email: string): Promise<boolean> {
    const user = await this.getUserByEmail(email);

    return user !== null || typeof user !== 'undefined';
  }

  async getUserByEmail(email: string): Promise<User>  {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: email },
      });
      return user;
    } catch (error) {
      console.log(error);
    }
  }
}
