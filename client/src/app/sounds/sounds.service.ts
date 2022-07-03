import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { NewSound, Sound } from './resources/classes/sound.class';
import { INewSound, ISound } from './resources/interfaces/sound.interface';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SoundsService {
  readonly BASE_URL = `${environment.apiUrl}/sounds`;
  sounds: (ISound | INewSound)[] | undefined;
  currentPlayingSound: string | null;

  constructor(private http: HttpClient) {
    this.currentPlayingSound = null;
  }

  getSounds(): Subscription {
    return this.http.get<ISound[]>(this.BASE_URL).subscribe((sounds) => {
      this.sounds = sounds.map((sound) => new Sound(sound));

      this.sounds.push(new NewSound());
    });
  }

  deleteSound(id: string): Observable<void> {
    return this.http.delete<any>(`${this.BASE_URL}/${id}`);
  }

  createSound(newSound: FormData): Observable<void> {
    return this.http.post<void>(this.BASE_URL, newSound);
  }
}
