import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import * as fs from 'fs';
import { join } from 'path';

export default class Utils {
  static isNodeEnvDev(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  static isFrontModeStart(): boolean {
    return Utils.isNodeEnvDev() && process.env.FRONT_MODE === 'start';
  }

  static getTlsCredentials(): HttpsOptions {
    const key = fs.readFileSync(
      join(__dirname, '..', '../cert/localhost-key.pem'),
    );
    const cert = fs.readFileSync(
      join(__dirname, '..', '../cert/localhost.pem'),
    );

    return {
      key,
      cert,
    };
  }
}
