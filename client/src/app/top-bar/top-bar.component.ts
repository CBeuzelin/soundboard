import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  public login() {
    window.location.replace('http://localhost:3000/api/auth/login');
  }
}
