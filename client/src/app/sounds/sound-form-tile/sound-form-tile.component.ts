import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { EFormAttributes } from '../resources/enums/sound.enum';

import { SoundsService } from '../sounds.service';
import { ISound } from '../resources/interfaces/sound.interface';

@Component({
  selector: 'app-sound-form-tile',
  templateUrl: './sound-form-tile.component.html',
  styleUrls: ['./sound-form-tile.component.scss'],
})
export class SoundFormTileComponent implements OnInit {
  @Input() sound: ISound | undefined;

  @Input() image: string | undefined;
  @Input() imageSource: Blob | undefined;

  @Input() audio: string | undefined;
  @Input() audioSource: Blob | undefined;

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
    this.form = this.formBuilder.group(this.buildForm());

    if (this.image && this.imageSource) {
      this.imagePreview = this.image;
    }

    this.hasAudio = !!(this.audio && this.audioSource);
  }

  private buildForm() {
    let title = '';
    let tags = '';
    let imageSource = null;
    let audioSource = null;
    const fileValidators = this.sound ? null : [Validators.required];

    if (this.sound) {
      title = this.sound.title;
      tags = this.sound.tags.toString();
      imageSource = this.imageSource;
      audioSource = this.audioSource;
    }

    return {
      [EFormAttributes.TITLE]: [
        title,
        [Validators.required, Validators.minLength(4)],
      ],
      [EFormAttributes.TAGS]: [tags],

      [EFormAttributes.IMAGE]: new FormControl(null, fileValidators),
      [EFormAttributes.IMAGE_SOURCE]: new FormControl(
        imageSource,
        fileValidators
      ),

      [EFormAttributes.AUDIO]: new FormControl(null, fileValidators),
      [EFormAttributes.AUDIO_SOURCE]: new FormControl(
        audioSource,
        fileValidators
      ),
    };
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
            this.soundService.refreshSounds();
          };
          reader.readAsDataURL(file);
        }

        if (formAttribute === EFormAttributes.AUDIO_SOURCE) {
          this.hasAudio = true;
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
    if (this.sound) {
      this.undoEdition.emit();
    } else {
      this.imagePreview = 'assets/images/sound_image_placeholder.png';
      this.hasAudio = false;
      this.form.reset();
    }
  }

  public onSubmit() {
    if (!this.form.invalid) {
      if (this.sound) {
        console.log('update sound');
      } else {
        const form = this.form.value;

        const newSoundFormData = new FormData();
        newSoundFormData.append(
          EFormAttributes.TITLE,
          form[EFormAttributes.TITLE]
        );
        newSoundFormData.append(
          EFormAttributes.TAGS,
          form[EFormAttributes.TAGS]
        );

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
}
