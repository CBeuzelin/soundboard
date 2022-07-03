import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ISound } from '../resources/interfaces/sound.interface';
import { SoundsService } from '../sounds.service';

@Component({
  selector: 'app-sound-tile',
  templateUrl: './sound-tile.component.html',
  styleUrls: ['./sound-tile.component.scss'],
})
export class SoundTileComponent implements OnInit {
  @Input() sound: ISound | undefined;

  isEditing: boolean;
  imageUrl: string;

  constructor(private soundService: SoundsService) {
    this.imageUrl = '';
    this.isEditing = false;
  }

  ngOnInit(): void {
    if (this.sound) {
      this.imageUrl = `${environment.apiBaseUrl}/image/${this.sound._id}`;
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
    if (this.sound) {
      this.soundService.playSound(this.sound._id);
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
