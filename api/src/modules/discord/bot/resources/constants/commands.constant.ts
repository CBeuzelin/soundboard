import { ECommands } from '../enums/commands.enum';

export const COMMANDS = [
  {
    name: ECommands.PING,
    description: 'Replies with pong!',
  },
  {
    name: ECommands.PLAY,
    description: 'Play a sound, given its id',
    options: [
      {
        name: 'id',
        description: 'Sound id',
        isRequired: true,
      },
    ],
  },
  {
    name: ECommands.SERVER,
    description: 'Replies with server info!',
  },
  {
    name: ECommands.USER,
    description: 'Replies with user info!',
  },
];
