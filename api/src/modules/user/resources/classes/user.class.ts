import { IUser } from '../interfaces/user.interface';

export class UserSession {
  id: string;
  name: string;
  discriminator: string;
  avatar: string;
  accessToken: string;

  constructor(user: IUser, accessToken: string) {
    this.id = user.id;
    this.name = user.name;
    this.discriminator = user.discriminator;
    this.avatar = user.avatar;
    this.accessToken = accessToken;
  }
}
