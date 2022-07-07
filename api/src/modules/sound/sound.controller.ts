import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
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
import { SoundPost, SoundPut } from './resources/classes/sound.class';
import { SoundDTO } from './resources/dto/sound.dto';
import { ESoundRoute } from './resources/enums/route.enum';
import { ESoundFileType } from './resources/enums/sound.enum';
import { ISoundFiles } from './resources/interfaces/sound.interface';
import { SoundService } from './sound.service';
import { FileUtils } from '../../utils/file-utils';
import { ESoundErrorEnum } from './resources/enums/error.enum';
import Bot from '../discord/bot';

const BOT = Bot.getInstance();

@Controller(ESoundRoute.ROOT)
export class SoundController {
  constructor(
    private soundService: SoundService,
    private userService: UserService,
  ) {}

  @Get()
  async getSounds() {
    return this.soundService.getSounds();
  }

  @Get(`:id/${ESoundRoute.IMAGE}`)
  async getSoundImage(@Req() req: Request) {
    return this.soundService.getSoundImage(req.params.id);
  }

  @Post()
  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: ESoundFileType.AUDIO, maxCount: 1 },
        { name: ESoundFileType.IMAGE, maxCount: 1 },
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
    if (!files[ESoundFileType.AUDIO] || !files[ESoundFileType.IMAGE]) {
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

  @Put(':id')
  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: ESoundFileType.AUDIO, maxCount: 1 },
        { name: ESoundFileType.IMAGE, maxCount: 1 },
      ],
      { fileFilter: FileUtils.fileFilter },
    ),
  )
  async updateSound(
    @Req() req: Request,
    @Res() res: Response,
    @Body() soundDto: SoundDTO,
    @UploadedFiles()
    files: ISoundFiles,
  ) {
    const sound = new SoundPut({ ...soundDto });

    const user = await this.userService.findUserFromSession(req.user);
    if (user) {
      return this.soundService
        .updateSound(req.params.id, sound, files, user)
        .then((newSound) => res.status(EHttpCode.CREATED).json(newSound))
        .catch((err) => {
          switch (err) {
            case ESoundErrorEnum.SOUND_NOT_FOUND:
              res.status(EHttpCode.NOT_FOUND).json(err);
              break;

            case ESoundErrorEnum.EDITION_NOT_ALLOWED:
              res.status(EHttpCode.FORBIDDEN).json(err);
              break;

            default:
              res.status(EHttpCode.INTERNAL_SERVER_ERROR).json(err);
              break;
          }
        });
    }

    res.sendStatus(EHttpCode.FORBIDDEN);
  }

  @Delete(':id')
  @UseGuards(AuthenticatedGuard)
  async archiveSound(@Req() req: Request) {
    return await this.soundService.archiveSound(req.params.id);
  }

  @Get(`:id/${ESoundRoute.PLAY}`)
  async playSound(@Req() req: Request, @Res() res: Response) {
    return BOT.playSound(req.params.id)
      .then(() => res.sendStatus(EHttpCode.OK))
      .catch(() => res.sendStatus(EHttpCode.INTERNAL_SERVER_ERROR));
  }
}
