import { Component, OnInit } from '@angular/core';
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
  AUDIO = 'audio',
}

@Component({
  selector: 'app-sound-form-tile',
  templateUrl: './sound-form-tile.component.html',
  styleUrls: ['./sound-form-tile.component.scss'],
})
export class SoundFormTileComponent implements OnInit {
  public form = new FormGroup({
    [EFormAttributes.TITLE]: new FormControl('', [Validators.required]),
    [EFormAttributes.TAGS]: new FormControl(''),
    [EFormAttributes.IMAGE]: new FormControl(null, [Validators.required]),
    [EFormAttributes.AUDIO]: new FormControl(null, [Validators.required]),
  });

  public formAttributes: typeof EFormAttributes = EFormAttributes;
  public audioExtensions = '.mp3,.m4a,.webm';
  public imageExtensions = '.jpeg,.jpg,.png,.gif';

  public imagePreview: string | null;

  constructor(
    public formBuilder: FormBuilder,
    private soundService: SoundsService
  ) {
    this.imagePreview = null;
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      [EFormAttributes.TITLE]: [
        '',
        [Validators.required, Validators.minLength(4)],
      ],
      [EFormAttributes.TAGS]: [''],
      [EFormAttributes.IMAGE]: [null],
      [EFormAttributes.AUDIO]: [null],
    });
  }

  public uploadFile(event: Event, formAttribute: EFormAttributes) {
    const files = (event.target as HTMLInputElement).files;

    if (files) {
      const file = files[0];

      if (!!file || (!file && !this.form.value[formAttribute])) {
        this.form.patchValue({ [formAttribute]: file });
        this.form.get(formAttribute)?.updateValueAndValidity();

        if (formAttribute === EFormAttributes.IMAGE) {
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
    newSoundFormData.append(EFormAttributes.IMAGE, form[EFormAttributes.IMAGE]);
    newSoundFormData.append(EFormAttributes.AUDIO, form[EFormAttributes.AUDIO]);

    this.soundService.createSound(newSoundFormData).subscribe(() => {
      this.onCancel();
      this.soundService.getSounds();
    });
  }
}
