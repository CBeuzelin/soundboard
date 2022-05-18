import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import * as passport from 'passport';
import 'dotenv/config';

import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //TODO: Chopper la même conf de cookies que pour le Portal
  app.enableCors();

  app.setGlobalPrefix('api');
  app.use(
    session({
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
      },
      secret: 'lzkejfhz;jkfeb',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(process.env.PORT);
}

bootstrap();
