import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

import { SoundsComponent } from './sounds.component';
import { SoundTileComponent } from './sound-tile/sound-tile.component';
import { SoundFormTileModule } from './sound-form-tile/sound-form-tile.module';

@NgModule({
  declarations: [SoundsComponent, SoundTileComponent],
  imports: [CommonModule, TranslateModule, SoundFormTileModule, MatIconModule],
})
export class SoundsModule {}
