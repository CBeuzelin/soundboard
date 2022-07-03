import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { ISound } from './resources/interfaces/sound.interface';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SoundsService {
  readonly BASE_URL = `${environment.apiUrl}/sounds`;
  sounds: ISound[] | undefined;
  currentPlayingSound: string | null;

  constructor(private http: HttpClient) {
    this.currentPlayingSound = null;
  }

  getSounds(): Subscription {
    return this.http.get<ISound[]>(this.BASE_URL).subscribe((sounds) => {
      this.sounds = sounds;
    });
  }

  deleteSound(id: string): Observable<void> {
    return this.http.delete<any>(`${this.BASE_URL}/${id}`);
  }

  createSound(newSound: FormData): Observable<void> {
    return this.http.post<void>(this.BASE_URL, newSound);
  }

  public playSound(sound: string | Blob) {
    const audio = document.createElement('audio');

    if (sound instanceof Blob) {
      audio.src = window.URL.createObjectURL(sound);
    } else {
      audio.src = `${environment.apiBaseUrl}/audio/${sound}`;
    }

    audio.addEventListener('loadedmetadata', () => {
      console.log(audio.duration);

      audio.play().then(() => {
        audio.removeEventListener('loadedmetadata', () => {});
      });
    });
  }
}
