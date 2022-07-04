import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { ISound } from './resources/interfaces/sound.interface';
import { Observable, Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SoundsService {
  readonly BASE_URL = `${environment.apiUrl}/sounds`;
  sounds: ISound[] | undefined;
  soundsChange: Subject<ISound[]> = new Subject<ISound[]>();

  currentPlayingSound: string | null;

  constructor(private http: HttpClient) {
    this.soundsChange.subscribe((sounds) => {
      this.sounds = sounds;
    });

    this.currentPlayingSound = null;
  }

  getSounds(): Subscription {
    return this.http
      .get<ISound[]>(this.BASE_URL)
      .subscribe((sounds) => this.refreshSounds(sounds));
  }

  refreshSounds(sounds = this.sounds) {
    if (sounds) {
      this.soundsChange.next(sounds);
    }
  }

  deleteSound(id: string): Observable<void> {
    return this.http.delete<any>(`${this.BASE_URL}/${id}`);
  }

  createSound(newSound: FormData): Observable<void> {
    return this.http.post<void>(this.BASE_URL, newSound);
  }

  public playSound(sound: Blob) {
    const audio = document.createElement('audio');

    audio.src = window.URL.createObjectURL(sound);

    audio.addEventListener('loadedmetadata', () => {
      console.log(audio.duration);

      audio.play().then(() => {
        audio.removeEventListener('loadedmetadata', () => {});
      });
    });
  }
}
