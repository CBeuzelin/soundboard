import { Controller, Get, Redirect, UseGuards } from '@nestjs/common';
import Utils from '../../utils/utils';

import { EAuthRoute } from './resources/enums/route.enum';
import { DiscordAuthGuard } from './resources/guards/discord-auth.guard';
import { EHttpCode } from '../../utils/resources/enums/http-code.enum';

const redirect = Utils.isFrontModeStart() ? process.env.FRONT_URL : '';

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
  @Redirect(`${redirect}/login-success`, EHttpCode.MOVED_PERMANENTLY)
  redirect(): void {
    return;
  }
}
