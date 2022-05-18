import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainModule } from './main/main.module';
import { TopBarComponent } from './top-bar/top-bar.component';
import { TopBarModule } from './top-bar/top-bar.module';

@NgModule({
  declarations: [AppComponent, TopBarComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TopBarModule,
    MainModule,
    HttpClientModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
