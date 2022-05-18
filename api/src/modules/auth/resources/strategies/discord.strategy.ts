import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Profile, Strategy } from 'passport-discord';
import { IUser } from '../../../user/resources/interfaces/user.interface';
import { EInjectToken } from '../enums/inject-token.enum';

import { EAuthRoute } from '../enums/route.enum';
import { EStrategy } from '../enums/strategy.enum';
import { IAuthenticationProvider } from '../interfaces/authentication-provider.interface';

@Injectable()
export class DiscordStrategy extends PassportStrategy(
  Strategy,
  EStrategy.DISCORD,
) {
  constructor(
    @Inject(EInjectToken.AUTH_SERVICE)
    private readonly authService: IAuthenticationProvider,
  ) {
    super({
      authorizationURL: process.env.DISCORD_AUTH_URL,
      tokenURL: process.env.DISCORD_AUTH_TOKEN_URL,
      clientID: process.env.DISCORD_AUTH_CLIENT_ID,
      clientSecret: process.env.DISCORD_AUTH_CLIENT_SECRET,
      scope: process.env.DISCORD_AUTH_SCOPE,
      callbackURL: `/api/${EAuthRoute.ROOT}/${EAuthRoute.REDIRECT}`,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const user: IUser = {
      id: profile.id,
      name: profile.username,
      discriminator: profile.discriminator,
      avatar: profile.avatar,
    };

    return this.authService.validateUser(user);
  }
}
