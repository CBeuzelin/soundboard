import { Schema as MongoSchema } from 'mongoose';
import { Express } from 'express';

import { IUser } from '../../../user/resources/interfaces/user.interface';
import { ESoundFileType } from '../enums/sound.enum';

export interface ISound {
  _id: MongoSchema.Types.ObjectId;
  title: string;
  tags: string[];
  createdAt: Date;
  author: IUser;
}

export interface ISoundFiles {
  [ESoundFileType.IMAGE]: Express.Multer.File;
  [ESoundFileType.AUDIO]: Express.Multer.File;
}
