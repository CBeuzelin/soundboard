import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from './resources/interfaces/user.interface';
import { User, UserDocument } from './resources/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(user: IUser): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findUserByDiscordId(discordId: string): Promise<User | undefined> {
    return this.userModel.findOne({ discordId });
  }

  async findUserFromSession(user: Express.User): Promise<User | undefined> {
    return this.findUserByDiscordId(user['discordId']);
  }

  async findUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
