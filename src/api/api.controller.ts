import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  RawBody,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { ApiService } from './api.service';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post('justify')
  async justifyText(
    @Body() text: string,
    @Headers('authorization') token: string,
  ): Promise<string> {
    return await this.apiService.justifyText(text, token);
  }
  @Post('token')
  async registreUser(@Body('email') email: string): Promise<string> {
    return await this.apiService.registreUser(email);
  }
}
