import { User } from '../schemas/user.schema';

export class UserGetDto {
  discordId: string;
  name: string;
  discriminator: string;
  avatar: string;

  constructor(user: User) {
    this.discordId = user.discordId;
    this.name = user.name;
    this.discriminator = user.discriminator;
    this.avatar = user.avatar;
  }
}
