import { IUser } from '../../../user/resources/interfaces/user.interface';

export interface IAuthenticationProvider {
  validateUser(user: IUser);
  createUser(user: IUser);
  findUser(id: string);
}
