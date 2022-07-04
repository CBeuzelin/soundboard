import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { ISound } from './resources/interfaces/sound.interface';
import { Observable, Subject, Subscription } from 'rxjs';
import { Sound } from './resources/classses/sound.class';

@Injectable({
  providedIn: 'root',
})
export class SoundsService {
  readonly BASE_URL = `${environment.apiUrl}/sounds`;
  sounds: Sound[] | undefined;
  soundsChange: Subject<Sound[]> = new Subject<Sound[]>();

  currentPlayingSound: string | null;

  constructor(private http: HttpClient) {
    this.soundsChange.subscribe((sounds) => {
      this.sounds = sounds;
    });

    this.currentPlayingSound = null;
  }

  public getSounds(): Subscription {
    return this.http
      .get<ISound[]>(this.BASE_URL)
      .subscribe((sounds) =>
        this.refreshSounds(sounds.map((sound) => new Sound(sound)))
      );
  }

  public refreshSounds(sounds = this.sounds) {
    if (sounds) {
      this.soundsChange.next(sounds);
    }
  }

  public createSound(newSound: FormData): Observable<void> {
    return this.http.post<void>(this.BASE_URL, newSound);
  }

  public updateSound(id: string, newSound: FormData): Observable<void> {
    return this.http.put<void>(`${this.BASE_URL}/${id}`, newSound);
  }

  public deleteSound(id: string): Observable<void> {
    return this.http.delete<any>(`${this.BASE_URL}/${id}`);
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
