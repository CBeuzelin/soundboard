import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { DiscordModule } from '../discord/discord.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { SoundModule } from '../sound/sound.module';

const MONGOOSE_CONNECTION_URI =
  `mongodb://${process.env.MONGODB_USER}` +
  `:${encodeURIComponent(process.env.MONGODB_PASSWORD)}` +
  `@${process.env.MONGODB_HOST}` +
  `:${process.env.MONGODB_PORT}` +
  `/${process.env.MONGODB_NAME}`;

@Module({
  imports: [
    AuthModule,
    DiscordModule,
    SoundModule,
    MongooseModule.forRoot(MONGOOSE_CONNECTION_URI),
    PassportModule.register({ session: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
