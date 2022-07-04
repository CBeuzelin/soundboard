import { SoundDTO } from '../dto/sound.dto';

export class SoundPost {
  title: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;

  constructor(payload: SoundDTO) {
    this.title = payload.title;
    this.tags = payload.tags.split(' ');

    const date = new Date();
    this.createdAt = date;
    this.updatedAt = date;
  }
}

export class SoundPut {
  title: string;
  tags: string[];
  updatedAt: Date;

  constructor(payload: SoundDTO) {
    this.title = payload.title;
    this.tags = payload.tags.split(' ');
    this.updatedAt = new Date();
  }
}
