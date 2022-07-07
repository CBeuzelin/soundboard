import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, Subscription } from 'rxjs';

import { environment } from '../../environments/environment';
import { ISound } from './resources/interfaces/sound.interface';
import { Sound } from './resources/classses/sound.class';
import FileStore from './resources/classses/file-store.class';

@Injectable({
  providedIn: 'root',
})
export class SoundsService {
  readonly BASE_URL = `${environment.apiUrl}/sounds`;

  sounds: Sound[] | undefined;
  soundsChange: Subject<Sound[]> = new Subject<Sound[]>();
  fileStore = FileStore.getInstance();

  constructor(private http: HttpClient) {
    this.soundsChange.subscribe((sounds) => {
      this.sounds = sounds;
    });
  }

  public getSounds(): Subscription {
    return this.http.get<ISound[]>(this.BASE_URL).subscribe((sounds) =>
      this.refreshSounds(
        sounds.map((sound) => {
          const newSound = new Sound(sound);

          newSound
            .setImage()
            .then(() => newSound.setAudio())
            .then(() => this.refreshSounds());

          return newSound;
        })
      )
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
    if (this.sounds) {
      if (newSound.has('image')) this.fileStore.removeImageFromStore(id);
      if (newSound.has('audio')) this.fileStore.removeAudioFromStore(id);
    }

    return this.http.put<void>(`${this.BASE_URL}/${id}`, newSound);
  }

  public deleteSound(id: string): Observable<void> {
    if (this.sounds) {
      this.fileStore.removeSoundFromStore(id);
    }

    return this.http.delete<any>(`${this.BASE_URL}/${id}`);
  }

  public playSound(id: string | null, sound?: Blob): void {
    if (sound) {
      const audio = document.createElement('audio');

      audio.src = window.URL.createObjectURL(sound);

      audio.addEventListener('loadedmetadata', () => {
        audio.play().then(() => {
          audio.removeEventListener('loadedmetadata', () => {});
        });
      });
    } else if (id) {
      this.http.get(`${environment.apiUrl}/discord/play/${id}`).subscribe();
    }
  }
}
