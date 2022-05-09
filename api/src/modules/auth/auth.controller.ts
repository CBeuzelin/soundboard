import { Controller, Get } from '@nestjs/common';

import { AuthRouteEnum } from './route.enum';
import { AuthService } from './auth.service';

@Controller(AuthRouteEnum.ROOT)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get(AuthRouteEnum.LOGIN)
  login(): string {
    return this.authService.login();
  }
}
