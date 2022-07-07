import { IsString } from 'class-validator';
import { UserGetDto } from '../../../user/resources/dto/user.dto';
import { Sound } from '../schemas/sound.schema';

export class SoundDTO {
  @IsString()
  title: string;

  @IsString()
  tags: string;
}

export class SoundGetDTO {
  id: string;
  title: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  author: UserGetDto;

  constructor(sound: Sound) {
    this.id = sound._id.toString();
    this.title = sound.title;
    this.tags = sound.tags;
    this.createdAt = sound.createdAt;
    this.updatedAt = sound.updatedAt;
    this.author = new UserGetDto(sound.author);
  }
}
