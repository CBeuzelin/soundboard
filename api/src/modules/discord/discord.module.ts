import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { DiscordService } from './discord.service';

@Module({
  imports: [HttpModule],
  exports: [DiscordService],
  providers: [DiscordService],
})
export class DiscordModule {}
