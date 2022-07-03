import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { EFormAttributes } from '../resources/enums/sound.enum';

import { SoundsService } from '../sounds.service';

@Component({
  selector: 'app-sound-form-tile',
  templateUrl: './sound-form-tile.component.html',
  styleUrls: ['./sound-form-tile.component.scss'],
})
export class SoundFormTileComponent {
  public formAttributes: typeof EFormAttributes = EFormAttributes;
  public audioExtensions = '.mp3,.m4a,.webm';
  public imageExtensions = '.jpeg,.jpg,.png,.gif';

  public imagePreview: string;
  public hasSound: boolean;
  public form: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private soundService: SoundsService
  ) {
    this.imagePreview = 'assets/images/sound_image_placeholder.png';
    this.hasSound = false;

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

        if (formAttribute === EFormAttributes.AUDIO_SOURCE) {
          this.hasSound = true;
        }
      }
    }
  }

  public playSound() {
    const sound = this.form.get(EFormAttributes.AUDIO_SOURCE);
    if (sound) {
      this.soundService.playSound(sound.value);
    }
  }

  public onReset() {
    this.imagePreview = 'assets/images/sound_image_placeholder.png';
    this.hasSound = false;
    this.form.reset();
  }

  public onSubmit() {
    if (!this.form.invalid) {
      const form = this.form.value;

      const newSoundFormData = new FormData();
      newSoundFormData.append(
        EFormAttributes.TITLE,
        form[EFormAttributes.TITLE]
      );
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
        this.onReset();
        this.soundService.getSounds();
      });
    }
  }
}
