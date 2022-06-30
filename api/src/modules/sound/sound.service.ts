import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Sound, SoundDocument } from './resources/schemas/sound.schema';
import { SoundPost } from './resources/classes/sound.class';
import { User } from '../user/resources/schemas/user.schema';

@Injectable()
export class SoundService {
  constructor(
    @InjectModel(Sound.name) private soundModel: Model<SoundDocument>,
  ) {}

  findSounds(): Promise<Sound[]> {
    return this.soundModel.find().exec();
  }

  async createSound(sound: SoundPost, author: User): Promise<Sound> {
    const newSound = new this.soundModel({ ...sound, author });
    return newSound.save();
  }

  async deleteSound(id: string): Promise<void> {
    return this.soundModel.findOneAndDelete({ _id: id });
  }
}
