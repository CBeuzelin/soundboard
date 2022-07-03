import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { SoundsService } from '../sounds.service';

enum EFormAttributes {
  TITLE = 'title',
  TAGS = 'tags',
  IMAGE = 'image',
  IMAGE_SOURCE = 'imageSource',
  AUDIO = 'audio',
  AUDIO_SOURCE = 'audioSource',
}

@Component({
  selector: 'app-sound-form-tile',
  templateUrl: './sound-form-tile.component.html',
  styleUrls: ['./sound-form-tile.component.scss'],
})
export class SoundFormTileComponent {
  public formAttributes: typeof EFormAttributes = EFormAttributes;
  public audioExtensions = '.mp3,.m4a,.webm';
  public imageExtensions = '.jpeg,.jpg,.png,.gif';

  public form: FormGroup;
  public imagePreview: string | null;

  constructor(
    public formBuilder: FormBuilder,
    private soundService: SoundsService
  ) {
    this.imagePreview = null;
    this.form = this.formBuilder.group({
      [EFormAttributes.TITLE]: [
        '',
        [Validators.required, Validators.minLength(4)],
      ],
      [EFormAttributes.TAGS]: [''],

      [EFormAttributes.IMAGE]: new FormControl(null, [Validators.required]),
      [EFormAttributes.IMAGE_SOURCE]: new FormControl(null, [
        Validators.required,
      ]),

      [EFormAttributes.AUDIO]: new FormControl(null, [Validators.required]),
      [EFormAttributes.AUDIO_SOURCE]: new FormControl(null, [
        Validators.required,
      ]),
    });
  }

  public onFileChange(event: Event, formAttribute: EFormAttributes) {
    const files = (event.target as HTMLInputElement).files;

    if (files) {
      const file = files[0];

      if (!!file || (!file && !this.form.value[formAttribute])) {
        this.form.patchValue({ [formAttribute]: file });

        if (formAttribute === EFormAttributes.IMAGE_SOURCE) {
          const reader = new FileReader();
          reader.onload = () => {
            this.imagePreview = reader.result as string;
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }

  public onCancel() {
    this.form.reset();
    this.imagePreview = null;
  }

  public onSubmit() {
    const form = this.form.value;

    const newSoundFormData = new FormData();
    newSoundFormData.append(EFormAttributes.TITLE, form[EFormAttributes.TITLE]);
    newSoundFormData.append(EFormAttributes.TAGS, form[EFormAttributes.TAGS]);

    newSoundFormData.append(
      EFormAttributes.IMAGE,
      this.form.get(EFormAttributes.IMAGE_SOURCE)?.value
    );
    newSoundFormData.append(
      EFormAttributes.AUDIO,
      this.form.get(EFormAttributes.AUDIO_SOURCE)?.value
    );

    this.soundService.createSound(newSoundFormData).subscribe(() => {
      this.onCancel();
      this.soundService.getSounds();
    });
  }
}
