import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SoundsComponent } from './sounds.component';

@NgModule({
  declarations: [SoundsComponent],
  imports: [CommonModule, TranslateModule],
})
export class SoundsModule {}
