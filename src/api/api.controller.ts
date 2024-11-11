import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiService } from './api.service';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post('justify')
  async justifyText(
    @Body() text: string,
    @Headers('authorization') token: string,
    @Headers('content-type') contentType: string,
  ): Promise<string> {
    this.apiService.validateContentType(contentType, 'text/plain');
    return await this.apiService.justifyText(text, token);
  }

  @Post('token')
  async registreUser(
    @Body('email') email: string,
    @Headers('content-type') contentType: string,
  ): Promise<string> {
    this.apiService.validateContentType(contentType, 'application/json');
    return await this.apiService.registreUser(email);
  }
}
