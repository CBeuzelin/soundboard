import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DiscordService {
  constructor(private http: HttpClient) {}

  getGuilds(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/discord/guilds`);
  }
}
