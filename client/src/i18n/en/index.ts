export const en = {
  message: {
    error: {
      userNotFound: 'User not found.',
      userAlreadyExists: 'User already exists.',
      incorrectPassword: 'Incorrect password.',
      emailAndPasswordAreRequired: 'Email and password are required.',
      emailIsNotRequired: 'Email is not required.',
      emailAlreadyExists: 'Email already exists.',

      unauthorized: 'Unauthorized access.',
      dontHavePermission: 'You do not have permission.',
      registerError: 'Registration error.',
      loginError: 'Login error.',

      roleNotFound: 'Role not found.',

      validateError: 'Validation error.',

      serverError: 'Server error.',

      invalidRefreshToken: 'Invalid refresh token.',
      refreshTokenIsNull: 'Refresh token is null.',
      refreshTokenExpired: 'Refresh token has expired.',

      sentEmailFail: 'Failed to send email.',
      emailIsNotVerified: 'Email is not verified.',
      invalidEmailToken: 'Invalid email verification token.',
      emailTokenNotFound: 'Email verification token not found.',
      emailTokenExpired: 'Email verification token has expired.',
      emailHasBeenVerified: 'Email has already been verified.',
      invalidResetPassToken: 'Invalid password reset token.',

      cateNotFound: 'Category not found.',
      cateNameIsExist: 'Category name already exists.',

      loginFail: 'Login fail. Email or password was wrong',
      register: 'Register fail',
      forgotPassword: 'Forgot password fail',
      resetPassword: 'Reset password fail',
    },
    success: {
      login: 'Login successfull',
      register: 'Register successfull. Please check your email',
      forgotPassword: 'Forgot password email has been sent',
      resetPassword: 'Password reset successfully',
    },
  },
  validation: {
    invalidEmailFormat: 'Invalid email format',
    invalidEmailDomain: 'Invalid email domain',
    emailMustBeString: 'Email must be a string',
    emailAndPasswordAreRequired: 'Email and password are required.',
    emailRequired: 'Email is required',

    passwordMinLength: 'Password must be at least 8 characters long',
    passwordMaxLength: 'Password must be at most 16 characters long',
    passwordFormat: 'Password must contain at least one lowercase letter, one uppercase letter, and one special character',
    passwordsMustMatch: 'Passwords must match',
    passwordRequired: 'Password is required',

    confirmPasswordRequired: 'Please confirm your password',

    resetTokenRequired: 'Reset token is required',

  }
}
