import { SoundDTO } from '../dto/sound.dto';

export class SoundPost {
  title: string;
  tags: string[];
  createdAt: Date;

  constructor(payload: SoundDTO) {
    this.title = payload.title;
    this.tags = payload.tags;
    this.createdAt = new Date();
  }
}
