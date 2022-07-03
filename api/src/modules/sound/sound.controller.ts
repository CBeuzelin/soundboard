import { Request, Response } from 'express';
import {
  BadRequestException,
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
import { extname } from 'path';
import { lookup } from 'mime-types';

import { ESoundRoute } from './resources/enums/route.enum';
import { SoundService } from './sound.service';
import { AuthenticatedGuard } from '../auth/resources/guards/authenticated.guard';
import { SoundPost } from './resources/classes/sound.class';
import { UserService } from '../user/user.service';
import { EHttpCode } from '../../utils/resources/enums/http-code.enum';
import { SoundDTO } from './resources/dto/sound.dto';
import { ISoundFiles } from './resources/interfaces/sound.interface';
import { EFileType } from './resources/enums/sound.enum';

const fileFilter = async (req, file, callback) => {
  const throwError = (error: string) => {
    return callback(
      new BadRequestException(
        `${error} - file: ${file.originalname} - field name: ${file.fieldname}`,
      ),
      false,
    );
  };

  let filetypes;
  if (file.fieldname === EFileType.AUDIO) filetypes = /mp3|m4a|webm/;
  if (file.fieldname === EFileType.IMAGE) filetypes = /jpeg|jpg|png|gif/;

  try {
    const extension = extname(file.originalname).toLowerCase();
    if (!filetypes.test(extension)) throwError('Invalid extension');
    if (!lookup(extension) === file.mimetype) throwError('Invalid mime type');

    return callback(null, true);
  } catch {
    throwError('Invalid file');
  }
};

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
      { fileFilter },
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
  async deleteSound(@Req() req: Request) {
    return await this.soundService.deleteSound(req.params.id);
  }
}
