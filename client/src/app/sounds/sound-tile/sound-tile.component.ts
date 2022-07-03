import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { NewSound, Sound } from '../resources/classes/sound.class';
import { SoundsService } from '../sounds.service';

@Component({
  selector: 'app-sound-tile',
  templateUrl: './sound-tile.component.html',
  styleUrls: ['./sound-tile.component.scss'],
})
export class SoundTileComponent implements OnInit {
  @Input() sound: Sound | NewSound | undefined;

  isNewSound: boolean = false;
  isEditing: boolean = false;
  imageUrl: string;

  constructor(private soundService: SoundsService) {
    this.imageUrl = '';
  }

  ngOnInit(): void {
    if (this.sound instanceof Sound) {
      this.imageUrl = `${environment.apiBaseUrl}/image/${this.sound._id}`;
    }

    this.isNewSound = this.sound instanceof NewSound;
    this.isEditing = this.isNewSound;
  }

  public deleteSound() {
    if (this.sound instanceof Sound) {
      this.soundService
        .deleteSound(this.sound._id)
        .subscribe(() => this.soundService.getSounds());
    }
  }

  public async playSound() {
    if (this.sound instanceof Sound) {
      const audio = document.createElement('audio');

      audio.src = `${environment.apiBaseUrl}/audio/${this.sound._id}`;

      audio.addEventListener('loadedmetadata', () => {
        console.log(audio.duration);

        audio.play().then(() => {
          audio.removeEventListener('loadedmetadata', () => {});
        });
      });
    }
  }

  public editSound() {
    if (this.sound) {
      this.isEditing = true;
    }
  }

  public undoEdition() {
    if (this.sound) {
      this.isEditing = false;
    }
  }

  public saveSound() {
    if (this.sound) {
      this.isEditing = false;
    }
  }
}
