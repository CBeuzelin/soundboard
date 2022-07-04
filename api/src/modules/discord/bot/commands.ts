import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Interaction } from 'discord.js';
import Bot from './index';

import { COMMANDS } from './resources/constants/commands.constant';
import { ECommands } from './resources/enums/commands.enum';

export default class Commands {
  private commands: any[];
  private rest: REST;

  constructor() {
    this.commands = COMMANDS.map((command) => {
      const slashCommand = new SlashCommandBuilder()
        .setName(command.name)
        .setDescription(command.description);
      if (command.options) {
        command.options.forEach((commandOption) => {
          slashCommand.addStringOption((option) =>
            option
              .setName(commandOption.name)
              .setDescription(commandOption.description)
              .setRequired(commandOption.isRequired),
          );
        });
      }

      return slashCommand;
    }).map((command) => command.toJSON());

    this.rest = new REST({ version: '9' }).setToken(
      process.env.DISCORD_BOT_TOKEN,
    );

    this.registerCommands();
  }

  public registerCommands() {
    this.rest
      .put(
        Routes.applicationGuildCommands(
          process.env.DISCORD_CLIENT_ID,
          process.env.DISCORD_GUILD_ID,
        ),
        { body: this.commands },
      )
      .then(() => console.log('Successfully registered application commands.'))
      .catch(console.error);
  }

  public async setupCommandReplies(interaction: Interaction) {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;
    const bot = Bot.getInstance();

    switch (commandName) {
      case ECommands.PING:
        await interaction.reply('Pong!');
        break;

      case ECommands.PLAY:
        const id = options.getString('id');
        await interaction.reply(`Playing ${id}...`);
        bot.playSound(options.getString('id'));
        break;

      case ECommands.SERVER:
        await interaction.reply('Server info');
        break;

      case ECommands.USER:
        await interaction.reply('User info');
        break;
    }
  }
}
