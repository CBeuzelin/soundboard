import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../../user/resources/schemas/user.schema';
import { ISound } from '../interfaces/sound.interface';

export type SoundDocument = Sound & Document;

@Schema()
export class Sound implements ISound {
  @Prop({ required: true })
  title: string;

  @Prop({ default: [] })
  tags: string[];

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  author: User;
}

export const SoundSchema = SchemaFactory.createForClass(Sound);
