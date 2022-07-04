import { Component, ViewChild } from '@angular/core';

import { SoundsService } from './sounds.service';
import { NgxMasonryComponent } from 'ngx-masonry';

@Component({
  selector: 'app-sounds',
  templateUrl: './sounds.component.html',
  styleUrls: ['./sounds.component.scss'],
})
export class SoundsComponent {
  @ViewChild(NgxMasonryComponent)
  public masonry: NgxMasonryComponent | undefined;

  masonryOptions = {
    gutter: 12,
    fitWidth: true,
  };

  constructor(public soundService: SoundsService) {
    this.soundService.getSounds();
  }

  ngAfterViewInit() {
    this.soundService.soundsChange.subscribe(() => {
      this.masonry?.layout();
    });
  }
}
