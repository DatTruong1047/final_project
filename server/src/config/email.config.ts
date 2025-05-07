import { TokenOption } from '@model';

import * as envConfig from './env.config';

export const emailConfig = {
  options: {
    host: envConfig.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(envConfig.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: envConfig.SMTP_USER,
      pass: envConfig.SMTP_PASS,
    },
  },
  resetPasswordUrl: `${envConfig.CLIENT_HOST}${envConfig.CLIENT_RESET_PASS_URL}`,
  verificationUrl: `${envConfig.CLIENT_HOST}${envConfig.CLIENT_VERIFICATION_URL}`,
  fromEmail: envConfig.SMTP_USER,
};

export const emailTokenOption: TokenOption = {
  expiresIn: '24h',
};

export const resetPasswordTokenOption: TokenOption = {
  expiresIn: '2h',
};
