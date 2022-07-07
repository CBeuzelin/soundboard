import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  PlayerSubscription,
  VoiceConnection,
} from '@discordjs/voice';
import { Client, GuildChannel, Intents } from 'discord.js';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { Subject } from 'rxjs';
import { EDiscordErrorEnum } from '../resources/enums/error.enum';

import Commands from './commands';

type Status = AudioPlayerStatus | 'Error';

interface AudioPlayerSubject {
  status: Status;
  message?: string;
}

export default class Bot {
  private static instance: Bot;

  private client: Client;
  private commands: Commands;
  private readonly audioPlayer: AudioPlayer = createAudioPlayer();
  private connection: VoiceConnection;
  private subscription: PlayerSubscription;
  private timeout: NodeJS.Timeout;
  private audioPlayerSubject: Subject<AudioPlayerSubject> =
    new Subject<AudioPlayerSubject>();
  private audioDuration: number | null;

  private constructor() {
    this.client = new Client({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES],
    });
    this.commands = new Commands();

    this.setupAudioPlayer();
  }

  public init(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.client.once('ready', () => {
        console.log('The Discord Bot is ready');
        resolve();
      });

      this.client.on('interactionCreate', this.commands.setupCommandReplies);

      this.client.login(process.env.DISCORD_BOT_TOKEN);
    });
  }

  public static getInstance(): Bot {
    if (!Bot.instance) {
      Bot.instance = new Bot();
    }

    return Bot.instance;
  }

  private wait(duration: number): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, duration);
    });
  }

  private updateAudioPlayerSubject = (status: Status, message?: string) => {
    this.audioPlayerSubject.next({ status, message });
  };

  private setupAudioPlayer() {
    this.audioPlayerSubject.subscribe((subject) => {
      if (subject.status === AudioPlayerStatus.Playing)
        clearTimeout(this.timeout);
    });

    this.audioPlayer.on(AudioPlayerStatus.Idle, () => {
      if (this.subscription && this.connection) {
        this.timeout = setTimeout(() => {
          this.subscription.unsubscribe();
          this.connection.destroy();
        }, this.audioDuration + 5000);
      }

      this.updateAudioPlayerSubject(AudioPlayerStatus.Idle);
    });

    this.audioPlayer.on(AudioPlayerStatus.Buffering, () => {
      this.updateAudioPlayerSubject(AudioPlayerStatus.Buffering);
    });

    this.audioPlayer.on(AudioPlayerStatus.Playing, () => {
      this.updateAudioPlayerSubject(AudioPlayerStatus.Playing);
    });

    this.audioPlayer.on(AudioPlayerStatus.Paused, () => {
      this.updateAudioPlayerSubject(AudioPlayerStatus.Paused);
    });

    this.audioPlayer.on('error', (error) => {
      console.error(
        'Error:',
        error.message,
        'with track',
        error.resource.metadata,
      );
      this.updateAudioPlayerSubject('Error', error.message);
    });
  }

  public playSound(soundId: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const channelId = '571296217812697088'; // Test
      // const channelId = '691052658529796167'; // Vrais amis

      const channel = this.client.channels.cache.get(channelId) as GuildChannel;

      if (!this.connection || this.connection.state.status === 'destroyed') {
        console.log('connecting to voice channel...');
        this.connection = joinVoiceChannel({
          channelId: channel.id,
          guildId: channel.guild.id,
          adapterCreator: channel.guild.voiceAdapterCreator,
        });

        await this.wait(700);
      }

      const audioLocation = `${process.env.UPLOADS_DIRECTORY}/audio/${soundId}`;

      try {
        this.audioDuration =
          (await getAudioDurationInSeconds(audioLocation)) * 1000;
      } catch {
        reject(EDiscordErrorEnum.AUDIO_NOT_FOUND);
      }

      // Will use FFmpeg with volume control enabled
      const resource = createAudioResource(audioLocation, {
        inlineVolume: true,
      });
      resource.volume.setVolume(0.5);
      // https://discordjs.guide/voice/audio-resources.html#creation

      this.audioPlayer.play(resource);

      this.subscription = this.connection.subscribe(this.audioPlayer);

      const timeout = setTimeout(() => {
        this.updateAudioPlayerSubject(
          'Error',
          EDiscordErrorEnum.AUDIO_PLAYING_TIMEOUT,
        );
      }, 5000);

      this.audioPlayerSubject.subscribe((subject) => {
        if (subject.status === 'Error') {
          reject(subject.message);
        } else {
          clearTimeout(timeout);
          resolve();
        }
        this.audioDuration = null;
      });
    });
  }
}
