import { IUser } from '../../../resources/interfaces/user.interface';
import { INewSound, ISound } from '../interfaces/sound.interface';

export class Sound implements ISound {
  _id: string;
  title: string;
  tags: string[];
  createdAt: Date;
  author: IUser;

  constructor(sound: ISound) {
    this._id = sound._id;
    this.title = sound.title;
    this.tags = sound.tags;
    this.createdAt = sound.createdAt;
    this.author = sound.author;
  }
}

export class NewSound implements INewSound {
  title: string;
  tags: string[];

  constructor() {
    this.title = '';
    this.tags = [];
  }
}
