import { Controller, Get, UseGuards } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AuthenticatedGuard } from '../auth/resources/guards/authenticated.guard';
import { DiscordService } from './discord.service';
import { EDiscordRoute } from './resources/enums/route.enum';

@Controller(EDiscordRoute.ROOT)
export class DiscordController {
  constructor(private readonly discordService: DiscordService) {}

  @Get(EDiscordRoute.GUILDS)
  @UseGuards(AuthenticatedGuard)
  async getGuilds() {
    const token = 'wfsOxRBip2NtRfPoJ5K1kjx0nWkDeU';

    const resGuilds = await firstValueFrom(
      this.discordService.getUserGuilds(token),
    );

    console.log(resGuilds.data);

    return resGuilds.data;
  }
}
