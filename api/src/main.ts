import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import * as passport from 'passport';
import 'dotenv/config';

import { AppModule } from './modules/app/app.module';
import Utils from './utils/utils';

async function bootstrap() {
  let httpsOptions = {};

  if (process.env.SECURE_TLS === 'Y') {
    httpsOptions = Utils.getTlsCredentials();
  }

  const app = await NestFactory.create(AppModule, { httpsOptions });

  let corsOptions = {};
  let sameSite = undefined;

  if (Utils.isFrontModeStart()) {
    corsOptions = {
      credentials: true,
      origin: [`http://localhost:${process.env.PORT}`, process.env.FRONT_URL],
    };

    sameSite = 'none';
  }

  app.enableCors(corsOptions);

  app.setGlobalPrefix('api');
  app.use(
    session({
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24h
        secure: true,
        httpOnly: true,
        sameSite,
      },
      secret: 'lzkejfhz;jkfeb',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT);
}

bootstrap();
