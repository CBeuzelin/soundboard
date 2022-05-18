import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DiscordController } from './discord.controller';

import { DiscordService } from './discord.service';

@Module({
  imports: [HttpModule],
  providers: [DiscordService],
  controllers: [DiscordController],
})
export class DiscordModule {}
