import { Component, OnInit } from '@angular/core';
import { SoundsService } from './sounds.service';

@Component({
  selector: 'app-sounds',
  templateUrl: './sounds.component.html',
  styleUrls: ['./sounds.component.scss'],
})
export class SoundsComponent implements OnInit {
  constructor(public soundService: SoundsService) {
    this.soundService.getSounds();
  }

  ngOnInit(): void {}

  public createSound() {
    this.soundService.createSound();
  }
}
