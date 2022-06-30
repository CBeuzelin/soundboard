import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SoundsComponent } from './sounds.component';
import { SoundTileComponent } from './sound-tile/sound-tile.component';

@NgModule({
  declarations: [SoundsComponent, SoundTileComponent],
  imports: [CommonModule, TranslateModule],
})
export class SoundsModule {}
