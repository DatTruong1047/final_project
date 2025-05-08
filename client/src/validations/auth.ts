import * as Yup from 'yup'
import { i18n } from '../main'

const t = i18n.global.t;

const emailType = Yup.string()
  .typeError(() => t('validation.emailMustBeString'))
  .required(() => t('validation.emailAndPasswordAreRequired'))
  .email(() => t('validation.invalidEmailFormat'))
  .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, () => t('validation.invalidEmailDomain'))


const passwordType = Yup.string()
  .typeError('Password must be string')
  .required('Password is required')
  .min(8, 'Password must be at least 8 characters long')
  .max(16, 'Password must be at most 16 characters long')
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>\[\]]).*$/,
    'Password must contain at least one lowercase letter, one uppercase letter, and one special character',
  )

export const RegisterRequestSchema = Yup.object().shape({
  email: emailType,
  password: passwordType,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], () => t('validation.passwordsMustMatch'))
    .required(() => t('validation.confirmPasswordRequired')),
})

export const LoginRequestSchema = Yup.object().shape({
  email: emailType,
  password: passwordType
})

export const ForgotPasswordRequestSchema = Yup.object().shape({
  email: emailType,
})

export const ResetPasswordRequestSchema = Yup.object().shape({
  resetToken: Yup.string(),
  password: passwordType,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], () => t('validation.passwordsMustMatch'))
    .required(() => t('validation.confirmPasswordRequired')),
})