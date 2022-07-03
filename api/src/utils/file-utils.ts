import { BadRequestException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { Express } from 'express';
import { lookup } from 'mime-types';
import { extname } from 'path';

import { ISoundFiles } from '../modules/sound/resources/interfaces/sound.interface';
import { EFileType } from '../modules/sound/resources/enums/sound.enum';

export class FileUtils {
  //region PRIVATE STORAGE METHODS
  private static createDirectory(dir: string) {
    return fs.mkdir(dir, { recursive: true });
  }

  private static storeFile(
    file: Express.Multer.File,
    dir: string,
    fileName: string,
  ) {
    const path = `${dir}/${fileName}`;

    return FileUtils.createDirectory(dir).then(() =>
      fs.writeFile(path, file.buffer),
    );
  }

  private static archiveFile(fileType: EFileType, fileName: string) {
    const oldPath = `${process.env.UPLOADS_DIRECTORY}/${fileType}/${fileName}`;
    const newDir = `${process.env.UPLOADS_DIRECTORY}/archives/${fileType}`;
    const newPath = `${newDir}/${fileName}`;

    return FileUtils.createDirectory(newDir).then(() =>
      fs.rename(oldPath, newPath),
    );
  }
  //endregion

  //region FILE STORAGE METHODS
  public static getFile(
    fileType: EFileType,
    fileName: string,
  ): Promise<Buffer> {
    const path = `${process.env.UPLOADS_DIRECTORY}/${fileType}/${fileName}`;
    return fs.readFile(path);
  }

  public static storeFiles(files: ISoundFiles, fileName: string) {
    const types = [EFileType.AUDIO, EFileType.IMAGE];

    const promises = types.map((type) => {
      const dir = `${process.env.UPLOADS_DIRECTORY}/${type}`;
      return FileUtils.storeFile(files[type][0], dir, fileName);
    });

    return Promise.all(promises);
  }

  public static archiveFiles(soundId: string): Promise<void[]> {
    const types = [EFileType.AUDIO, EFileType.IMAGE];

    const promises = types.map((type) => FileUtils.archiveFile(type, soundId));

    return Promise.all(promises);
  }
  //endregion

  //region FILE UPLOAD METHODS
  public static async fileFilter(req, file, callback) {
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
  }
  //endregion
}
