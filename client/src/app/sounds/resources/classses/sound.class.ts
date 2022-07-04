import { IUser } from '../../../resources/interfaces/user.interface';
import { ISound } from '../interfaces/sound.interface';
import { environment } from '../../../../environments/environment';
import Utils from '../../../../utils/utils';
import FileStore from './file-store.class';

const fileStore = FileStore.getInstance();
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
  }

  public async setImage() {
    const image = fileStore.getImageFromStore(this._id);
    const imageUrl = `${environment.apiBaseUrl}/image/${this._id}`;

    if (image) {
      this.imageUrl = imageUrl;
      this.image = image;
    } else {
      await Utils.fetchFile(imageUrl)
        .then((blob) => {
          this.imageUrl = imageUrl;
          this.image = blob;
          fileStore.setImageInStore(this._id, blob);
        })
        .catch(() => {
          this.imageUrl = placeHolderImageUrl;
        });
    }
  }

  public async setAudio() {
    const audio = fileStore.getAudioFromStore(this._id);
    const audioUrl = `${environment.apiBaseUrl}/audio/${this._id}`;

    if (audio) {
      this.audioUrl = audioUrl;
      this.audio = audio;
    } else {
      await Utils.fetchFile(audioUrl)
        .then((blob) => {
          this.audioUrl = audioUrl;
          this.audio = blob;
          fileStore.setAudioInStore(this._id, blob);
        })
        .catch(() => {
          this.audioUrl = placeHolderAudioUrl;
        });
    }
  }
}
