import { Injectable } from '@nestjs/common';
import { UserSession } from '../user/resources/classes/user.class';
import { IUser } from '../user/resources/interfaces/user.interface';
import { User } from '../user/resources/schemas/user.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(user: IUser, accessToken: string): Promise<UserSession> {
    const dbUser = await this.userService.findUserByDiscordId(user.discordId);
    if (dbUser) return new UserSession(dbUser, accessToken);

    const userCreated = await this.createUser(user);

    return new UserSession(userCreated, accessToken);
  }

  createUser(user: IUser): Promise<User> {
    return this.userService.createUser(user);
  }

  findUser(id: string): Promise<User | undefined> {
    return this.userService.findUserByDiscordId(id);
  }
}
