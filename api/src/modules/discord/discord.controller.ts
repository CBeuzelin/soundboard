import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';

import { EHttpCode } from '../../utils/resources/enums/http-code.enum';
import { AuthenticatedGuard } from '../auth/resources/guards/authenticated.guard';
import { DiscordService } from './discord.service';
import { EDiscordErrorEnum } from './resources/enums/error.enum';
import { EDiscordRoute } from './resources/enums/route.enum';
import Bot from '../discord/bot';

const BOT = Bot.getInstance();
@Controller(EDiscordRoute.ROOT)
export class DiscordController {
  constructor(private readonly discordService: DiscordService) {}

  @Get(EDiscordRoute.GUILDS)
  @UseGuards(AuthenticatedGuard)
  async getGuilds(@Req() req: Request) {
    const resGuilds = await firstValueFrom(
      this.discordService.getUserGuilds(req.user['accessToken']),
    );

    return resGuilds.data;
  }

  @Get(`${EDiscordRoute.PLAY}/:id`)
  async playSound(@Req() req: Request, @Res() res: Response) {
    return BOT.playSound(req.params.id)
      .then(() => res.sendStatus(EHttpCode.OK))
      .catch((err) => {
        if (err === EDiscordErrorEnum.AUDIO_NOT_FOUND) {
          return res
            .status(EHttpCode.NOT_FOUND)
            .json(EDiscordErrorEnum.AUDIO_NOT_FOUND);
        }

        return res.sendStatus(EHttpCode.INTERNAL_SERVER_ERROR);
      });
  }
}
