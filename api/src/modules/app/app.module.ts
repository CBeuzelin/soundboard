import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { DiscordModule } from '../discord/discord.module';
import Utils from '../../utils/utils';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';

const CLIENT_BUILD_DIR = Utils.isNodeEnvDev()
  ? '../../../client/dist/client'
  : 'client';

@Module({
  imports: [
    AuthModule,
    DiscordModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', CLIENT_BUILD_DIR),
    }),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_NAME}`,
    ),
    PassportModule.register({ session: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
