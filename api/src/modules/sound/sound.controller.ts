import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';

import { EHttpCode } from '../../utils/resources/enums/http-code.enum';
import { AuthenticatedGuard } from '../auth/resources/guards/authenticated.guard';
import { UserService } from '../user/user.service';
import { SoundPost } from './resources/classes/sound.class';
import { SoundDTO } from './resources/dto/sound.dto';
import { ESoundRoute } from './resources/enums/route.enum';
import { EFileType } from './resources/enums/sound.enum';
import { ISoundFiles } from './resources/interfaces/sound.interface';
import { SoundService } from './sound.service';
import { FileUtils } from '../../utils/file-utils';

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
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: EFileType.AUDIO, maxCount: 1 },
        { name: EFileType.IMAGE, maxCount: 1 },
      ],
      { fileFilter: FileUtils.fileFilter },
    ),
  )
  async createSound(
    @Req() req: Request,
    @Res() res: Response,
    @Body() soundDto: SoundDTO,
    @UploadedFiles()
    files: ISoundFiles,
  ) {
    const sound = new SoundPost({ ...soundDto });
    if (!files[EFileType.AUDIO] || !files[EFileType.IMAGE]) {
      return res.sendStatus(EHttpCode.BAD_REQUEST);
    }

    const user = await this.userService.findUserFromSession(req.user);

    if (user) {
      return this.soundService
        .createSound(sound, files, user)
        .then((newSound) => res.status(EHttpCode.CREATED).json(newSound))
        .catch((err) => res.status(EHttpCode.INTERNAL_SERVER_ERROR).json(err));
    }

    res.sendStatus(EHttpCode.FORBIDDEN);
  }

  @Delete(':id')
  @UseGuards(AuthenticatedGuard)
  async archiveSound(@Req() req: Request) {
    return await this.soundService.archiveSound(req.params.id);
  }
}
