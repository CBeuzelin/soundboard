import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';
import { ERoute } from '../resources/enums/route.enum';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements OnInit {
  public tabs = [
    {
      routerLink: '/home',
      tabKey: 'home._',
      translation: '',
    },
    {
      routerLink: `/${ERoute.SOUNDS}`,
      tabKey: 'sounds._',
      translation: '',
    },
  ];

  constructor(private translate: TranslateService) {
    this.translate.use('en').subscribe(() => {
      this.translateTabs();
    });
  }

  ngOnInit(): void {}

  public switchLang(): void {
    this.translate
      .use(this.translate.currentLang === 'fr' ? 'en' : 'fr')
      .subscribe(() => {
        this.translateTabs();
      });
  }

  public translateTabs() {
    for (const tab of this.tabs) {
      tab.translation = this.translate.instant(tab.tabKey);
    }
  }

  public getCurrentLang(): string {
    return this.translate.currentLang || 'en';
  }

  public login(): void {
    window.location.replace(`${environment.apiUrl}/auth/login`);
  }
}
