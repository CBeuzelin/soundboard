import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { AuthRouteEnum } from './route.enum';
import { DiscordAuthGuard } from './strategy/discord-auth.guard';
import { DiscordService } from '../discord/discord.service';

@Controller(AuthRouteEnum.ROOT)
export class AuthController {
  constructor(private readonly discordService: DiscordService) {}

  @UseGuards(DiscordAuthGuard)
  @Get(AuthRouteEnum.LOGIN)
  login(): void {
    return;
  }

  @UseGuards(DiscordAuthGuard)
  @Get(AuthRouteEnum.CALLBACK)
  async callback(@Req() req, @Res() res) {
    const authInfo = req.authInfo;

    if (!authInfo) {
      res.redirect('/');
      return;
    }

    req.user = undefined;

    console.log(authInfo.accessToken);

    const resUser = await firstValueFrom(
      this.discordService.getUser(authInfo.accessToken),
    ).catch((err) => {
      console.log(err);
    });

    console.log(resUser.data);

    if (!!resUser && resUser.data) {
      req.logIn(resUser.data, (err) => {
        console.log(err);
      });
    }

    // const resGuilds = await firstValueFrom(
    //   this.discordService.getUserGuilds(authInfo.accessToken),
    // );
    //
    // console.log(resGuilds.data);

    return res.redirect('http://localhost:4200/login-success');
  }
}
