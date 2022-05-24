export class SoundPost {
  title: string;
  tags: string[];
  createdAt: Date;

  constructor(payload: { title: string; tags: string[] }) {
    this.title = payload.title;
    this.tags = payload.tags;
    this.createdAt = new Date();
  }
}
