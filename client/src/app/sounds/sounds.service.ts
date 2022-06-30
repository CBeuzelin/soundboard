import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { ISound } from './resources/interfaces/sound.interface';

@Injectable({
  providedIn: 'root',
})
export class SoundsService {
  sounds: ISound[] | undefined;

  constructor(private http: HttpClient) {}

  getSounds(): void {
    this.http
      .get<ISound[]>(`${environment.apiBaseUrl}/sounds`)
      .subscribe((sounds) => {
        this.sounds = sounds;
      });
  }

  deleteSound(id: string): void {
    this.http
      .delete<any>(`${environment.apiBaseUrl}/sounds/${id}`)
      .subscribe(() => this.getSounds());
  }

  createSound(): void {
    const payload = {
      title: 'title1',
      tags: ['tag1', 'tag2'],
    };

    this.http
      .post<void>(`${environment.apiBaseUrl}/sounds`, payload)
      .subscribe(() => this.getSounds());
  }
}
