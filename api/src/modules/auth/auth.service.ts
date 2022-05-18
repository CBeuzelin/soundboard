import { Injectable } from '@nestjs/common';
import { IUser } from '../user/resources/interfaces/user.interface';
import { User } from '../user/resources/schemas/user.schema';
import { UserService } from '../user/user.service';
import { IAuthenticationProvider } from './resources/interfaces/authentication-provider.interface';

@Injectable()
export class AuthService implements IAuthenticationProvider {
  constructor(private readonly userService: UserService) {}

  async validateUser(user: IUser): Promise<User> {
    const dbUser = await this.userService.findUser(user.id);
    if (dbUser) return dbUser;
    return this.createUser(user);
  }

  createUser(user: IUser): Promise<User> {
    return this.userService.createUser(user);
  }

  findUser(id: string): Promise<User | undefined> {
    return this.userService.findUser(id);
  }
}
