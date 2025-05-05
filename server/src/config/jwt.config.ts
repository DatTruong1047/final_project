import { TokenOption } from '@model';

export const accessTokenOption: TokenOption = {
  expiresIn: '2h',
};

export const refreshTokenOption: TokenOption = {
  expiresIn: '7d',
};
