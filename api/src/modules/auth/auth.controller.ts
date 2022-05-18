import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { EAuthRoute } from './resources/enums/route.enum';
import { DiscordAuthGuard } from './resources/guards/discord-auth.guard';

@Controller(EAuthRoute.ROOT)
export class AuthController {
  @Get(EAuthRoute.LOGIN)
  @UseGuards(DiscordAuthGuard)
  login(): void {
    return;
  }

  @Get(EAuthRoute.LOGOUT)
  @UseGuards(DiscordAuthGuard)
  logout(): void {
    return;
  }

  @Get(EAuthRoute.REDIRECT)
  @UseGuards(DiscordAuthGuard)
  async redirect(@Res() res: Response) {
    // res.send(200);
    return res.redirect('http://localhost:4200/login-success');
  }
}
