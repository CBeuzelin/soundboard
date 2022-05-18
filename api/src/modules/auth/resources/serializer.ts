import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { IUser } from '../../user/resources/interfaces/user.interface';
import { EInjectToken } from './enums/inject-token.enum';
import { IAuthenticationProvider } from './interfaces/authentication-provider.interface';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject(EInjectToken.AUTH_SERVICE)
    private readonly authService: IAuthenticationProvider,
  ) {
    super();
  }

  serializeUser(user: IUser, done: (err: Error, user: IUser) => void) {
    done(null, user);
  }

  async deserializeUser(user: IUser, done: (err: Error, user: IUser) => void) {
    const userDb = await this.authService.findUser(user.id);
    done(null, userDb || null);
  }
}
