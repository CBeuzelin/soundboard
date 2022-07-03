import { Component, Input, OnInit } from '@angular/core';
import { ISound } from '../resources/interfaces/sound.interface';
import { SoundsService } from '../sounds.service';

@Component({
  selector: 'app-sound-tile',
  templateUrl: './sound-tile.component.html',
  styleUrls: ['./sound-tile.component.scss'],
})
export class SoundTileComponent implements OnInit {
  @Input() sound: ISound | undefined;

  constructor(private soundService: SoundsService) {}

  ngOnInit(): void {}

  public deleteSound(id: string) {
    this.soundService
      .deleteSound(id)
      .subscribe(() => this.soundService.getSounds());
  }
}
