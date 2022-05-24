import { Module } from '@nestjs/common';
import { SoundController } from './sound.controller';
import { SoundService } from './sound.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Sound, SoundSchema } from './resources/schemas/sound.schema';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: Sound.name, schema: SoundSchema }]),
  ],
  controllers: [SoundController],
  providers: [SoundService],
})
export class SoundModule {}
