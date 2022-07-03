import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SoundFormTileComponent } from './sound-form-tile.component';

@NgModule({
  declarations: [SoundFormTileComponent],
  imports: [CommonModule, TranslateModule, ReactiveFormsModule],
  exports: [SoundFormTileComponent],
})
export class SoundFormTileModule {}
