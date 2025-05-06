export enum ErrorCodes {
  USER_NOT_FOUND = 1001,
  USER_ALREADY_EXISTS = 1002,
  INCORRECT_PASSWORD = 1003,
  EMAIL_AND_PASSWORD_ARE_REQUIRE = 1004,
  EMAIL_IS_NOT_REQUIRE = 1005,
  EMAIL_ALREADY_EXISTS = 1006,

  UNAUTHORIZED = 2001,
  DONT_HAVE_PERMISSION = 2002,
  REGISTER_ERROR = 2003,
  LOGIN_ERROR = 2004,

  ROLE_NOT_FOUND = 3001,

  VALIDATE_ERROR = 4001,

  SERVER_ERROR = 5001,

  INVALID_REFRESH_TOKEN = 6001,
  REFRESH_TOKEN_IS_NULL = 6002,
  REFRESH_TOKEN_EXPIRED = 6003,

  SENT_EMAIL_FAIL = 7001,
  EMAIL_IS_NOT_VERIFIED = 7002,
  INVALID_EMAIL_TOKEN = 7003,
  EMAIL_TOKEN_NOT_FOUND = 7004,
  EMAIL_TOKEN_EXPIRED = 7005,
  EMAIL_HAS_BEEN_VERIFIED = 7006,
  INVALID_RESET_PASS_TOKEN = 7007,

  CATE_NOT_FOUND = 9000,
  CATE_NAME_IS_EXIST = 9001,
}

export const ErrorMessages: Record<ErrorCodes, string> = {
  [ErrorCodes.USER_NOT_FOUND]: 'User not found.',
  [ErrorCodes.USER_ALREADY_EXISTS]: 'User already exists.',
  [ErrorCodes.INCORRECT_PASSWORD]: 'Incorrect password.',
  [ErrorCodes.EMAIL_AND_PASSWORD_ARE_REQUIRE]: 'Email and password are required.',
  [ErrorCodes.EMAIL_IS_NOT_REQUIRE]: 'Email is not required.',
  [ErrorCodes.EMAIL_ALREADY_EXISTS]: 'Email already exists.',

  [ErrorCodes.UNAUTHORIZED]: 'Unauthorized access.',
  [ErrorCodes.DONT_HAVE_PERMISSION]: 'You do not have permission.',
  [ErrorCodes.REGISTER_ERROR]: 'Registration error.',
  [ErrorCodes.LOGIN_ERROR]: 'Login error.',

  [ErrorCodes.ROLE_NOT_FOUND]: 'Role not found.',

  [ErrorCodes.VALIDATE_ERROR]: 'Validation error.',

  [ErrorCodes.SERVER_ERROR]: 'Server error.',

  [ErrorCodes.INVALID_REFRESH_TOKEN]: 'Invalid refresh token.',
  [ErrorCodes.REFRESH_TOKEN_IS_NULL]: 'Refresh token is null.',
  [ErrorCodes.REFRESH_TOKEN_EXPIRED]: 'Refresh token has expired.',

  [ErrorCodes.SENT_EMAIL_FAIL]: 'Failed to send email.',
  [ErrorCodes.EMAIL_IS_NOT_VERIFIED]: 'Email is not verified.',
  [ErrorCodes.INVALID_EMAIL_TOKEN]: 'Invalid email verification token.',
  [ErrorCodes.EMAIL_TOKEN_NOT_FOUND]: 'Email verification token not found.',
  [ErrorCodes.EMAIL_TOKEN_EXPIRED]: 'Email verification token has expired.',
  [ErrorCodes.EMAIL_HAS_BEEN_VERIFIED]: 'Email has already been verified.',
  [ErrorCodes.INVALID_RESET_PASS_TOKEN]: 'Invalid password reset token.',

  [ErrorCodes.CATE_NOT_FOUND]: 'Category not found.',
  [ErrorCodes.CATE_NAME_IS_EXIST]: 'Category name already exists.',
}
