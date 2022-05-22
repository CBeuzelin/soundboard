import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';

import { AuthController } from './auth.controller';
import { DiscordStrategy } from './resources/strategies/discord.strategy';
import { AuthService } from './auth.service';
import { SessionSerializer } from './resources/serializer';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [DiscordStrategy, SessionSerializer, AuthService],
})
export class AuthModule {}
