import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';

import { ERoute } from './resources/enums/route.enum';
import { SoundsComponent } from './sounds/sounds.component';

const routes: Routes = [
  { path: 'home', component: MainComponent },
  { path: ERoute.SOUNDS, component: SoundsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
