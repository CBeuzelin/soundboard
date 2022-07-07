import { IUser } from '../../../resources/interfaces/user.interface';

export interface ISound {
  id: string;
  title: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  author: IUser;
}
