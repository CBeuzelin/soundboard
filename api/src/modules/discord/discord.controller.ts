import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { AuthenticatedGuard } from '../auth/resources/guards/authenticated.guard';
import { DiscordService } from './discord.service';
import { EDiscordRoute } from './resources/enums/route.enum';

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
}
