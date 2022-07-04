import { IUser } from '../../../resources/interfaces/user.interface';
import { ISound } from '../interfaces/sound.interface';
import { environment } from '../../../../environments/environment';
import Utils from '../../../../utils/utils';

const placeHolderImageUrl = 'assets/images/sound_image_placeholder.png';
const placeHolderAudioUrl = '';

export class Sound {
  _id: string;
  title: string;
  tags: string[];
  createdAt: Date;
  author: IUser;

  image: Blob | undefined;
  imageUrl = placeHolderImageUrl;

  audio: Blob | undefined;
  audioUrl = placeHolderAudioUrl;

  constructor(sound: ISound) {
    this._id = sound._id;
    this.title = sound.title;
    this.tags = sound.tags;
    this.createdAt = sound.createdAt;
    this.author = sound.author;

    const imageUrl = `${environment.apiBaseUrl}/image/${this._id}`;
    Utils.fetchFile(imageUrl)
      .then((blob) => {
        this.imageUrl = imageUrl;
        this.image = blob;
      })
      .catch(() => {
        this.imageUrl = placeHolderImageUrl;
      });

    this.audioUrl = '';
    const audioUrl = `${environment.apiBaseUrl}/audio/${this._id}`;
    Utils.fetchFile(audioUrl)
      .then((blob) => {
        this.audioUrl = audioUrl;
        this.audio = blob;
      })
      .catch(() => {
        this.audioUrl = placeHolderAudioUrl;
      });
  }
}
