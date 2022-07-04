import { Client, GuildChannel, Intents } from 'discord.js';
import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  PlayerSubscription,
  VoiceConnection,
} from '@discordjs/voice';

import Commands from './commands';

// 62c1a94c2e85bbe0a881e525 - okay
// 62c1d60ee49e58c59796a828 - combien
// 62c1d623e49e58c59796a82f - david goodenough
// 62c1d782e49e58c59796a843 - oh vos gueules
// 62c1d838e49e58c59796a84e - cependant

export default class Bot {
  private static instance: Bot;

  private client: Client;
  private commands: Commands;
  private readonly audioPlayer: AudioPlayer = createAudioPlayer();
  private connection: VoiceConnection;
  private subscription: PlayerSubscription;

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

  private static logStates(oldState, newState) {
    console.log('old state:', oldState.status);
    console.log('new state:', newState.status);
    console.log('=========');
  }

  private setupAudioPlayer() {
    this.audioPlayer.on(AudioPlayerStatus.Idle, (oldState, newState) => {
      console.log('AUDIO PLAYER', 'Idle');
      Bot.logStates(oldState, newState);

      if (this.subscription) {
        setTimeout(() => {
          this.subscription.unsubscribe();
          this.connection.destroy();
        }, 5000);
      }
    });

    this.audioPlayer.on(AudioPlayerStatus.Buffering, (oldState, newState) => {
      console.log('AUDIO PLAYER', 'Buffering');
      Bot.logStates(oldState, newState);
    });

    this.audioPlayer.on(AudioPlayerStatus.Playing, (oldState, newState) => {
      console.log('AUDIO PLAYER', 'Playing');
      Bot.logStates(oldState, newState);
    });

    this.audioPlayer.on(AudioPlayerStatus.Paused, (oldState, newState) => {
      console.log('AUDIO PLAYER', 'Paused');
      Bot.logStates(oldState, newState);
    });

    this.audioPlayer.on('error', (error) => {
      console.error(
        'Error:',
        error.message,
        'with track',
        error.resource.metadata,
      );
    });
  }

  public playSound(soundId: string): void {
    const channel = this.client.channels.cache.get(
      '691052658529796167',
    ) as GuildChannel;

    this.connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    const audioLocation = `${process.env.UPLOADS_DIRECTORY}/audio/${soundId}`;

    // Will use FFmpeg with volume control enabled
    const resource = createAudioResource(audioLocation, { inlineVolume: true });
    resource.volume.setVolume(0.5);
    // https://discordjs.guide/voice/audio-resources.html#creation

    this.audioPlayer.play(resource);

    this.subscription = this.connection.subscribe(this.audioPlayer);
  }
}
