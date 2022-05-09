import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class DiscordService {
  constructor(private readonly httpService: HttpService) {}

  getUser(accessToken: string): Observable<any> {
    const config = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };

    return this.httpService.get('https://discord.com/api/users/@me', config);
  }

  getUserGuilds(accessToken: string): Observable<any> {
    const config = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };

    return this.httpService.get(
      'https://discord.com/api/users/@me/guilds',
      config,
    );
  }
}
