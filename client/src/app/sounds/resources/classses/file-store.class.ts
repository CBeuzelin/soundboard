import { SoundFiles } from '../interfaces/sound-files.interface';

export default class FileStore {
  private static instance: FileStore;

  soundFiles: SoundFiles[];

  private constructor() {
    this.soundFiles = [];
  }

  public static getInstance(): FileStore {
    if (!FileStore.instance) {
      FileStore.instance = new FileStore();
    }

    return FileStore.instance;
  }

  private addSoundToStore(
    id: string,
    imageBlob?: Blob,
    audioBlob?: Blob
  ): void {
    const soundFilesIndex = this.soundFiles.findIndex((el) => el.id === id);

    if (soundFilesIndex === -1) {
      this.soundFiles.push({ id, imageBlob, audioBlob });
    } else {
      if (imageBlob) this.soundFiles[soundFilesIndex].imageBlob = imageBlob;
      if (audioBlob) this.soundFiles[soundFilesIndex].audioBlob = audioBlob;
    }
  }

  public getImageFromStore(id: string): Blob | undefined {
    const sound = this.soundFiles.find((el) => el.id === id);
    return sound ? sound.imageBlob : undefined;
  }

  public getAudioFromStore(id: string): Blob | undefined {
    const sound = this.soundFiles.find((el) => el.id === id);
    return sound ? sound.audioBlob : undefined;
  }

  public setImageInStore(id: string, image: Blob): void {
    this.addSoundToStore(id, image);
  }

  public setAudioInStore(id: string, audio: Blob): void {
    this.addSoundToStore(id, undefined, audio);
  }

  public removeSoundFromStore(id: string): void {
    const soundFilesIndex = this.soundFiles.findIndex((el) => el.id === id);

    if (soundFilesIndex > -1) {
      this.soundFiles.splice(soundFilesIndex, 1);
    }
  }

  public removeImageFromStore(id: string): void {
    const soundFilesIndex = this.soundFiles.findIndex((el) => el.id === id);

    if (soundFilesIndex > -1) {
      this.soundFiles[soundFilesIndex].imageBlob = undefined;
    }
  }

  public removeAudioFromStore(id: string): void {
    const soundFilesIndex = this.soundFiles.findIndex((el) => el.id === id);

    if (soundFilesIndex > -1) {
      delete this.soundFiles[soundFilesIndex].audioBlob;
    }
  }
}
