import { Component, Input, Output } from '@angular/core';

import { SoundsService } from '../sounds.service';
import { Sound } from '../resources/classses/sound.class';

@Component({
  selector: 'app-sound-tile',
  templateUrl: './sound-tile.component.html',
})
export class SoundTileComponent {
  @Input() sound: Sound | undefined;

  isEditing: boolean;

  constructor(private soundService: SoundsService) {
    this.isEditing = false;
  }

  public deleteSound() {
    if (this.sound) {
      this.soundService
        .deleteSound(this.sound._id)
        .subscribe(() => this.soundService.getSounds());
    }
  }

  public async playSound() {
    if (this.sound?.audio) {
      this.soundService.playSound(this.sound._id);
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
}
