import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IUser } from '../interfaces/user.interface';

export type UserDocument = User & Document;

@Schema()
export class User implements IUser {
  @Prop({ required: true, unique: true })
  discordId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  discriminator: string;

  @Prop({ nullable: true })
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
