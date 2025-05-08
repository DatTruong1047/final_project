import app from '@app/app';
import { TokenPayloadType, TokenOption } from '@model';

export function generateToken(payload: TokenPayloadType, options: TokenOption): string {
  try {
    const token = app.jwt.sign(payload, {
      ...options,
    });
    return token;
  } catch (error) {
    throw new Error(error);
  }
}
