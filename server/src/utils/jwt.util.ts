import { TokenPayloadType, TokenOption } from '@model';

import app from '@app/app';

export function generateToken(payload: TokenPayloadType, options: TokenOption) {
  try {
    const token = app.jwt.sign(payload, {
      ...options,
    });
    return token;
  } catch (error) {
    throw new Error(error);
  }
}
