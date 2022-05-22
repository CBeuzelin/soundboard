import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CustomInterceptor } from '../../utils/http-interceptor';
import { MainComponent } from './main.component';

@NgModule({
  declarations: [MainComponent],
  exports: [MainComponent],
  imports: [CommonModule, TranslateModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomInterceptor,
      multi: true,
    },
  ],
})
export class MainModule {}
