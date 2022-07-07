import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { EFormAttributes } from '../resources/enums/sound.enum';
import { SoundsService } from '../sounds.service';
import { Sound } from '../resources/classses/sound.class';

@Component({
  selector: 'app-sound-form-tile',
  templateUrl: './sound-form-tile.component.html',
  styleUrls: ['./sound-form-tile.component.scss'],
})
export class SoundFormTileComponent implements OnInit {
  @Input() sound: Sound | undefined;

  @Output('undoEdition') undoEdition: EventEmitter<any> = new EventEmitter();

  public formAttributes: typeof EFormAttributes = EFormAttributes;
  public audioExtensions = '.mp3,.m4a,.webm';
  public imageExtensions = '.jpeg,.jpg,.png,.gif';

  public imagePreview: string;
  public hasAudio: boolean;
  public form: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private soundService: SoundsService
  ) {
    this.imagePreview = 'assets/images/sound_image_placeholder.png';
    this.hasAudio = false;
    this.form = this.formBuilder.group(this.buildForm());
  }

  ngOnInit() {
    if (this.sound?.image && this.sound?.imageUrl) {
      this.imagePreview = this.sound.imageUrl;
    }

    this.hasAudio = !!(this.sound?.audio && this.sound?.audioUrl);
    this.form = this.formBuilder.group(this.buildForm());
  }

  private buildForm() {
    let title = '';
    let tags = '';
    let image = null;
    let audio = null;
    const fileValidators = this.sound ? null : [Validators.required];

    if (this.sound) {
      title = this.sound.title;
      tags = this.sound.tags.toString();
      image = this.sound.image;
      audio = this.sound.audio;
    }

    return {
      [EFormAttributes.TITLE]: [
        title,
        [Validators.required, Validators.minLength(4)],
      ],
      [EFormAttributes.TAGS]: [tags],

      [EFormAttributes.IMAGE_URL]: new FormControl(null, fileValidators),
      [EFormAttributes.IMAGE]: new FormControl(image, fileValidators),

      [EFormAttributes.AUDIO_URL]: new FormControl(null, fileValidators),
      [EFormAttributes.AUDIO]: new FormControl(audio, fileValidators),
    };
  }

  public getInputId(formAttribute: EFormAttributes) {
    return `${formAttribute}-${this.sound?.id ?? ''}`;
  }

  public onFileChange(event: Event, formAttribute: EFormAttributes) {
    const files = (event.target as HTMLInputElement).files;

    if (files) {
      const file = files[0];

      if (!!file || (!file && !this.form.value[formAttribute])) {
        this.form.patchValue({ [formAttribute]: file });

        if (formAttribute === EFormAttributes.IMAGE) {
          const reader = new FileReader();
          reader.onload = () => {
            this.imagePreview = reader.result as string;
            this.soundService.refreshSounds();
          };
          reader.readAsDataURL(file);
        }

        if (formAttribute === EFormAttributes.AUDIO) {
          this.hasAudio = true;
        }
      }
    }
  }

  public playSound() {
    const sound = this.form.get(EFormAttributes.AUDIO);
    if (sound) {
      this.soundService.playSound(null, sound.value);
    }
  }

  public onReset() {
    if (this.sound) {
      this.undoEdition.emit();
    } else {
      this.imagePreview = 'assets/images/sound_image_placeholder.png';
      this.hasAudio = false;
      this.form.reset();
    }

    this.soundService.refreshSounds();
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

      if (this.sound) {
        if (this.form.get(EFormAttributes.IMAGE_URL)?.value) {
          newSoundFormData.append(
            EFormAttributes.IMAGE,
            this.form.get(EFormAttributes.IMAGE)?.value
          );
        }

        if (this.form.get(EFormAttributes.AUDIO_URL)?.value) {
          newSoundFormData.append(
            EFormAttributes.AUDIO,
            this.form.get(EFormAttributes.AUDIO)?.value
          );
        }

        this.soundService
          .updateSound(this.sound.id, newSoundFormData)
          .subscribe(() => {
            this.onReset();
            this.soundService.getSounds();
          });
      } else {
        newSoundFormData.append(
          EFormAttributes.IMAGE,
          this.form.get(EFormAttributes.IMAGE)?.value
        );
        newSoundFormData.append(
          EFormAttributes.AUDIO,
          this.form.get(EFormAttributes.AUDIO)?.value
        );

        this.soundService.createSound(newSoundFormData).subscribe(() => {
          this.onReset();
          this.soundService.getSounds();
        });
      }
    }
  }
}
