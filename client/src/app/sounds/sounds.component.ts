import { Component, OnInit } from '@angular/core';
import { SoundsService } from './sounds.service';

@Component({
  selector: 'app-sounds',
  templateUrl: './sounds.component.html',
  styleUrls: ['./sounds.component.scss'],
})
export class SoundsComponent implements OnInit {
  coucou = 'nope';
  sounds: any[] | undefined = undefined;

  constructor(private soundService: SoundsService) {}

  ngOnInit(): void {
    this.getSounds();
  }

  public getSounds() {
    this.soundService.getSounds().subscribe((sounds) => {
      this.sounds = sounds;
    });
  }

  public createSound() {
    this.soundService.createSound().subscribe(() => {
      this.coucou = 'yep';
      this.getSounds();
    });
  }
}
