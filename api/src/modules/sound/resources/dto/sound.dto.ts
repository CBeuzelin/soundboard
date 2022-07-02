import { IsString } from 'class-validator';

export class SoundDTO {
  @IsString()
  title: string;

  @IsString()
  tags: string;
}
