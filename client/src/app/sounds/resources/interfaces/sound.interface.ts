import { IUser } from '../../../resources/interfaces/user.interface';

export interface ISound {
  _id: string;
  title: string;
  tags: string[];
  createdAt: Date;
  author: IUser;
}
