import { Component, Input, OnInit, Output } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ISound } from '../resources/interfaces/sound.interface';
import { SoundsService } from '../sounds.service';
import Utils from '../../../utils/utils';

@Component({
  selector: 'app-sound-tile',
  templateUrl: './sound-tile.component.html',
  styleUrls: ['./sound-tile.component.scss'],
})
export class SoundTileComponent implements OnInit {
  @Input() sound: ISound | undefined;

  isEditing: boolean;

  image: Blob | undefined;
  imageUrl: string;

  audio: Blob | undefined;
  audioUrl: string;

  constructor(private soundService: SoundsService) {
    this.isEditing = false;
    this.imageUrl = '';
    this.audioUrl = '';
  }

  ngOnInit(): void {
    if (this.sound) {
      const imageUrl = `${environment.apiBaseUrl}/image/${this.sound._id}`;
      Utils.fetchFile(imageUrl)
        .then((blob) => {
          this.imageUrl = imageUrl;
          this.image = blob;
        })
        .catch(() => {
          this.imageUrl = 'assets/images/sound_image_placeholder.png';
        });

      const audioUrl = `${environment.apiBaseUrl}/audio/${this.sound._id}`;
      Utils.fetchFile(audioUrl)
        .then((blob) => {
          this.audioUrl = audioUrl;
          this.audio = blob;
        })
        .catch(() => {
          this.audioUrl = '';
        });
    }
  }

  public deleteSound() {
    if (this.sound) {
      this.soundService
        .deleteSound(this.sound._id)
        .subscribe(() => this.soundService.getSounds());
    }
  }

  public async playSound() {
    if (this.audio) {
      this.soundService.playSound(this.audio);
    }
  }

  public editSound() {
    if (this.sound) {
      this.isEditing = true;
    }
  }

  @Output() undoEdition() {
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
