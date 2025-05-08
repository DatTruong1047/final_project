import * as Yup from 'yup'

export const RegisterRequestSchema = Yup.object().shape({
  email: Yup.string().typeError('Email must be string').required('Email is required').email(),
  password: Yup.string()
    .typeError('Password must be a string')
    .min(8, 'Password must be at least 8 characters long')
    .max(16, 'Password must be at most 16 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>\[\]]).*$/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one special character',
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
})

export const LoginRequestSchema = Yup.object().shape({
  email: Yup.string().typeError('Email must be string').required('Email is required').email(),
  password: Yup.string()
    .typeError('Password must be a string')
    .min(8, 'Password must be at least 8 characters long')
    .max(16, 'Password must be at most 16 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>\[\]]).*$/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one special character',
    )
    .required('Password is required'),
})
