import fs from 'fs';
import { Express } from 'express';

import { ISoundFiles } from '../modules/sound/resources/interfaces/sound.interface';
import { EFileType } from '../modules/sound/resources/enums/sound.enum';

export class StorageUtils {
  private static createDirectory(dir: string) {
    return fs.promises
      .mkdir(dir, { recursive: true })
      .then((res) => {
        console.log('createDirectory', res);
      })
      .catch((err) => {
        console.log('createDirectory err', err);
      });
  }

  private static storeFile(
    file: Express.Multer.File,
    dir: string,
    fileName: string,
  ) {
    return StorageUtils.createDirectory(dir).then(() => {
      const path = `${dir}/${fileName}`;
      return fs.promises
        .writeFile(path, file.buffer)
        .then((res) => {
          console.log('storeFile', res);
        })
        .catch((err) => {
          console.log('storeFile err', err);
        });
    });
  }

  private static removeFile(dir: string, fileName: string) {
    const path = `${dir}/${fileName}`;
    return new Promise<void>((resolve, reject) => {
      fs.unlink(path, (err) => {
        if (err && !err.message.includes('no such file or directory')) {
          reject(err.message);
        }
        resolve();
      });
    });
  }

  public static storeFiles(files: ISoundFiles, fileName: string) {
    // const types = [EFileType.AUDIO, EFileType.IMAGE];
    const dir = `${process.env.UPLOADS_DIRECTORY}/${EFileType.AUDIO}`;

    fs.mkdir(dir, { recursive: true }), )

    return fs.promises.mkdir(dir, { recursive: true }).then((res) => {
      console.log(res);
    });

    // const promises = types.map((type) => {
    //   const dir = `${process.env.UPLOADS_DIRECTORY}/${type}`;
    //   return StorageUtils.storeFile(files[type][0], dir, fileName);
    // });
    //
    // return Promise.all(promises)
    //   .then((res) => {
    //     console.log('storeFiles', res);
    //   })
    //   .catch((err) => {
    //     console.log('storeFiles err', err);
    //   });
  }

  public static archiveFiles(soundId: string): Promise<void[]> {
    const types = [EFileType.AUDIO, EFileType.IMAGE];

    const promises = types.map((type) => {
      const dir = `${process.env.UPLOADS_DIRECTORY}/${type}`;
      return StorageUtils.removeFile(dir, soundId);
    });

    return Promise.all(promises);
  }
}
