import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ESoundRoute } from './resources/enums/route.enum';
import { SoundService } from './sound.service';
import { AuthenticatedGuard } from '../auth/resources/guards/authenticated.guard';
import { Request, Response } from 'express';
import { SoundPost } from './resources/classes/sound.class';
import { UserService } from '../user/user.service';
import { EHttpCode } from '../../utils/resources/enums/http-code.enum';

@Controller(ESoundRoute.ROOT)
export class SoundController {
  constructor(
    private soundService: SoundService,
    private userService: UserService,
  ) {}

  @Get()
  async getSounds() {
    return this.soundService.findSounds();
  }

  @Post()
  @UseGuards(AuthenticatedGuard)
  async createSound(@Req() req: Request, @Res() res: Response) {
    const payload = {
      title: 'test',
      tags: ['titi', 'toto'],
    };

    const sound = new SoundPost(payload);
    const user = await this.userService.findUserFromSession(req.user);
    if (user) {
      const newSound = await this.soundService.createSound(sound, user);
      return res.status(EHttpCode.CREATED).json(newSound);
    }

    res.sendStatus(EHttpCode.FORBIDDEN);
  }
}
