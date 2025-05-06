import dotenv from 'dotenv';
dotenv.config();

export const PORT = +process.env.PORT;
export const SECRET_KEY = process.env.SECRET_KEY;

export const SMTP_HOST = process.env.SMTP_HOST;
export const SMTP_PORT = process.env.SMTP_PORT;
export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASS = process.env.SMTP_PASS;

export const VERIFICATION_URL = process.env.VERIFICATION_URL;
export const RESETPASSWORD_URL = process.env.RESETPASSWORD_URL;

export const HOST = process.env.HOST;

export const CLIENT_HOST = process.env.CLIENT_HOST || 'http://localhost';
export const CLIENT_POST = process.env.CLIENT_POST || 5173;
export const CLIENT_FORGOT_PASS_URL = process.env.CLIENT_FORGOT_PASS_URL || '/forgot-password/';
