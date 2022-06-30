import { IUser } from '../../../user/resources/interfaces/user.interface';
import { Schema as MongoSchema } from 'mongoose';

export interface ISound {
  _id: MongoSchema.Types.ObjectId;
  title: string;
  tags: string[];
  createdAt: Date;
  author: IUser;
}
