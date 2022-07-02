import { IUser } from '../../../user/resources/interfaces/user.interface';
import { Schema as MongoSchema } from 'mongoose';
import { Express } from 'express';
import { EFileType } from '../enums/sound.enum';

export interface ISound {
  _id: MongoSchema.Types.ObjectId;
  title: string;
  tags: string[];
  createdAt: Date;
  author: IUser;
}

export interface ISoundFiles {
  [EFileType.IMAGE]: Express.Multer.File;
  [EFileType.AUDIO]: Express.Multer.File;
}
