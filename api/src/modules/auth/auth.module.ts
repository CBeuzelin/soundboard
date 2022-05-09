import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { DiscordModule } from '../discord/discord.module';
import { AuthController } from './auth.controller';
import { DiscordStrategy } from './strategy/discord.strategy';

@Module({
  imports: [HttpModule, DiscordModule],
  controllers: [AuthController],
  providers: [DiscordStrategy],
})
export class AuthModule {}
