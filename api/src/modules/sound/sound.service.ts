import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';

import { Sound, SoundDocument } from './resources/schemas/sound.schema';
import { SoundPost } from './resources/classes/sound.class';
import { User } from '../user/resources/schemas/user.schema';
import { ISoundFiles } from './resources/interfaces/sound.interface';
import { EFileType } from './resources/enums/sound.enum';

@Injectable()
export class SoundService {
  constructor(
    @InjectModel(Sound.name) private soundModel: Model<SoundDocument>,
  ) {}

  findSounds(): Promise<Sound[]> {
    return this.soundModel.find().exec();
  }

  private storeFiles(files: ISoundFiles, soundId: string) {
    const types = [EFileType.AUDIO, EFileType.IMAGE];

    const promises = types.map((type) => {
      return new Promise<void>((resolve, reject) => {
        const dir = `${process.env.UPLOADS_DIRECTORY}/${type}`;
        const path = `${dir}/${soundId}`;

        fs.mkdir(dir, { recursive: true }, (err) => {
          if (err) reject(err);

          fs.writeFile(path, files[type][0].buffer, (err) => {
            if (err) reject(err);
            resolve();
          });
        });
      });
    });

    return Promise.all(promises);
  }

  private removeFiles(soundId: string): Promise<void[]> {
    const formattedFiles = [EFileType.AUDIO, EFileType.IMAGE];

    const promises = formattedFiles.map((type) => {
      return new Promise<void>((resolve, reject) => {
        const path = `${process.env.UPLOADS_DIRECTORY}/${type}/${soundId}`;

        fs.unlink(path, (err) => {
          if (err) reject(err);
          resolve();
        });
      });
    });

    return Promise.all(promises);
  }

  createSound(
    sound: SoundPost,
    files: ISoundFiles,
    author: User,
  ): Promise<Sound> {
    const newSound = new this.soundModel({ ...sound, author });
    return newSound.save().then((sound) => {
      return this.storeFiles(files, sound._id).then(() => sound);
    });
  }

  deleteSound(id: string): Promise<void[]> {
    return this.soundModel
      .findOneAndDelete({ _id: id })
      .then(() => this.removeFiles(id));
  }
}
