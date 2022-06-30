import { Request, Response } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { ESoundRoute } from './resources/enums/route.enum';
import { SoundService } from './sound.service';
import { AuthenticatedGuard } from '../auth/resources/guards/authenticated.guard';
import { SoundPost } from './resources/classes/sound.class';
import { UserService } from '../user/user.service';
import { EHttpCode } from '../../utils/resources/enums/http-code.enum';
import { SoundDTO } from './resources/dto/sound.dto';

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
  async createSound(
    @Req() req: Request,
    @Res() res: Response,
    @Body() soundDto: SoundDTO,
  ) {
    const sound = new SoundPost({ ...soundDto });
    const user = await this.userService.findUserFromSession(req.user);
    if (user) {
      const newSound = await this.soundService.createSound(sound, user);
      return res.status(EHttpCode.CREATED).json(newSound);
    }

    res.sendStatus(EHttpCode.FORBIDDEN);
  }

  @Delete(':id')
  @UseGuards(AuthenticatedGuard)
  async deleteSound(@Req() req: Request) {
    return await this.soundService.deleteSound(req.params.id);
  }
}
