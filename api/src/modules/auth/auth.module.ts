import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';

import { AuthController } from './auth.controller';
import { EInjectToken } from './resources/enums/inject-token.enum';
import { DiscordStrategy } from './resources/strategies/discord.strategy';
import { AuthService } from './auth.service';
import { SessionSerializer } from './resources/serializer';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [
    DiscordStrategy,
    SessionSerializer,
    {
      provide: EInjectToken.AUTH_SERVICE,
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}
