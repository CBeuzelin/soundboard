import { IUser } from '../../../user/resources/interfaces/user.interface';

export interface ISound {
  title: string;
  tags: string[];
  createdAt: Date;
  author: IUser;
}
