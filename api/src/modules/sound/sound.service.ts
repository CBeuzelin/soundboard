import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Sound, SoundDocument } from './resources/schemas/sound.schema';
import { SoundPost } from './resources/classes/sound.class';
import { User } from '../user/resources/schemas/user.schema';
import { ISoundFiles } from './resources/interfaces/sound.interface';
import { StorageUtils } from '../../utils/storageUtils';

@Injectable()
export class SoundService {
  constructor(
    @InjectModel(Sound.name) private soundModel: Model<SoundDocument>,
  ) {}

  public findSounds(): Promise<Sound[]> {
    return this.soundModel.find().exec();
  }

  createSound(
    sound: SoundPost,
    files: ISoundFiles,
    author: User,
  ): Promise<Sound> {
    const newSound = new this.soundModel({ ...sound, author });
    return newSound.save().then((sound) => {
      return StorageUtils.storeFiles(files, sound._id).then(() => sound);
    });
  }

  archiveSound(id: string): Promise<void[]> {
    this.soundModel.findOneAndUpdate({ _id: id }, { isArchived: true });

    return StorageUtils.archiveFiles(id).then(() =>
      this.soundModel.findOneAndDelete({ _id: id }),
    );
  }
}
