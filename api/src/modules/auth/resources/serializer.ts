import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserSession } from '../../user/resources/classes/user.class';
import { AuthService } from '../auth.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  serializeUser(
    user: UserSession,
    done: (err: Error, user: UserSession) => void,
  ) {
    done(null, user);
  }

  async deserializeUser(
    user: UserSession,
    done: (err: Error, user: UserSession) => void,
  ) {
    const userDb = await this.authService.findUser(user.id);

    const userSession = userDb
      ? new UserSession(userDb, user.accessToken)
      : null;

    done(null, userSession);
  }
}
