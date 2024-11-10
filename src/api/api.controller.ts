import { Body, Controller, Get, Post, RawBody, RawBodyRequest, Req } from '@nestjs/common';
import { ApiService } from './api.service';

@Controller('api')
export class ApiController {
  
  constructor (private readonly apiService: ApiService){}
  
  @Post("justify")
  justifyText(@Body() text: string): string {
    return this.apiService.justifyText(text);
  }
  @Post("token")
  async registreUser(@Body("email") email: string): Promise<string> {
    return await this.apiService.registreUser(email);
  }
}
