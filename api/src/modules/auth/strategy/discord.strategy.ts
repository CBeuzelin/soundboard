import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-oauth2';
import { AuthRouteEnum } from '../route.enum';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor() {
    super(
      {
        authorizationURL: process.env.DISCORD_AUTH_URL,
        tokenURL: process.env.DISCORD_AUTH_TOKEN_URL,
        clientID: process.env.DISCORD_AUTH_CLIENT_ID,
        clientSecret: process.env.DISCORD_AUTH_CLIENT_SECRET,
        scope: process.env.DISCORD_AUTH_SCOPE,
        callbackURL: `/${AuthRouteEnum.ROOT}/${AuthRouteEnum.CALLBACK}`,
      },
      (
        accessToken: string,
        refreshToken: string,
        expires_in: number,
        profile: any,
        done: any,
      ): void => {
        return done(null, profile, { accessToken, refreshToken, expires_in });
      },
    );
  }
}
