import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Sound, SoundDocument } from './resources/schemas/sound.schema';
import { SoundPost, SoundPut } from './resources/classes/sound.class';
import { User } from '../user/resources/schemas/user.schema';
import { ISoundFiles } from './resources/interfaces/sound.interface';
import { FileUtils } from '../../utils/file-utils';
import { ESoundFileType } from './resources/enums/sound.enum';
import { ESoundErrorEnum } from './resources/enums/error.enum';

@Injectable()
export class SoundService {
  constructor(
    @InjectModel(Sound.name) private soundModel: Model<SoundDocument>,
  ) {}

  public getSounds(): Promise<Sound[]> {
    return this.soundModel.find({ isArchived: false }).exec();
  }

  public getSound(
    id: string,
    isArchived?: boolean,
  ): Promise<Sound | undefined> {
    const filter = { _id: id };

    if (isArchived !== undefined) {
      filter['isArchived'] = isArchived;
    }

    return this.soundModel.findOne(filter).exec();
  }

  public getSoundImage(id: string): Promise<Buffer> {
    return FileUtils.getFile(ESoundFileType.IMAGE, id);
  }

  public createSound(
    sound: SoundPost,
    files: ISoundFiles,
    author: User,
  ): Promise<Sound> {
    const newSound = new this.soundModel({ ...sound, author });
    return newSound.save().then((sound) => {
      return FileUtils.storeFiles(files, sound._id).then(() => sound);
    });
  }

  public updateSound(
    id: string,
    sound: SoundPut,
    files: ISoundFiles,
    author: User,
  ): Promise<Sound> {
    return this.getSound(id, false).then((foundSound) => {
      if (!foundSound) {
        throw ESoundErrorEnum.SOUND_NOT_FOUND;
      }

      if (foundSound.author._id.toString() !== author._id.toString()) {
        throw ESoundErrorEnum.EDITION_NOT_ALLOWED;
      }

      return this.soundModel
        .findOneAndUpdate({ _id: id }, sound)
        .exec()
        .then((savedSound) =>
          FileUtils.updateFiles(files, savedSound._id).then(() => savedSound),
        );
    });
  }

  public archiveSound(id: string): Promise<void[]> {
    return FileUtils.archiveFiles(id).then(() =>
      this.soundModel.findOneAndUpdate({ _id: id }, { isArchived: true }),
    );
  }
}
