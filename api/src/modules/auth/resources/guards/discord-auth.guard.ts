import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EStrategy } from '../enums/strategy.enum';

@Injectable()
export class DiscordAuthGuard extends AuthGuard(EStrategy.DISCORD) {
  async canActivate(context: ExecutionContext) {
    const activate = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return activate;
  }
}
