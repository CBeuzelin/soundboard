import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DiscordService {
  constructor(private http: HttpClient) {}

  getGuilds(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/api/discord/guilds');
  }
}
