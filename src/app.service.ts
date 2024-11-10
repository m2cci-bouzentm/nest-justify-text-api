import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  redirectToApi(): void {
    console.log("Redirecting to the api ...");
  }
}
