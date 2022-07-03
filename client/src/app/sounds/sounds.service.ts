import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { ISound } from './resources/interfaces/sound.interface';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SoundsService {
  sounds: ISound[] | undefined;

  constructor(private http: HttpClient) {}

  getSounds(): Subscription {
    return this.http
      .get<ISound[]>(`${environment.apiBaseUrl}/sounds`)
      .subscribe((sounds) => {
        this.sounds = sounds;
      });
  }

  deleteSound(id: string): Observable<void> {
    return this.http.delete<any>(`${environment.apiBaseUrl}/sounds/${id}`);
  }

  createSound(newSound: FormData): Observable<void> {
    return this.http.post<void>(`${environment.apiBaseUrl}/sounds`, newSound);
  }
}
