import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMasonryModule } from 'ngx-masonry';

import { SoundsComponent } from './sounds.component';
import { SoundTileComponent } from './sound-tile/sound-tile.component';
import { SoundFormTileComponent } from './sound-form-tile/sound-form-tile.component';

@NgModule({
  declarations: [SoundsComponent, SoundTileComponent, SoundFormTileComponent],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatIconModule,
    NgxMasonryModule,
  ],
})
export class SoundsModule {}
