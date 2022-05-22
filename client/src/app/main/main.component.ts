import { Component, OnInit } from '@angular/core';
import { DiscordService } from '../discord.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  constructor(private discordService: DiscordService) {}

  public loading = false;
  public guilds: any[] = [];

  ngOnInit(): void {
    this.getGuilds();
  }

  public getGuilds(): void {
    this.loading = true;
    this.discordService.getGuilds().subscribe((guilds) => {
      this.guilds = guilds;
      this.loading = false;
    });
  }
}
