import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import Utils from '../../utils/utils';

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
    const redirect = Utils.isFrontModeStart() ? process.env.FRONT_URL : '';
    return res.redirect(`${redirect}/login-success`);
  }
}
