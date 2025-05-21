import dotenv from 'dotenv';
dotenv.config();

export const PORT = +process.env.PORT;
export const SECRET_KEY = process.env.SECRET_KEY;

export const SMTP_HOST = process.env.SMTP_HOST;
export const SMTP_PORT = process.env.SMTP_PORT;
export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASS = process.env.SMTP_PASS;

export const HOST = process.env.HOST;

export const CLIENT_HOST = process.env.CLIENT_HOST || 'http://localhost:5137/';
export const CLIENT_RESET_PASS_URL = process.env.CLIENT_FORGOT_PASS_URL || 'auth/reset-password';
export const CLIENT_VERIFICATION_URL = process.env.CLIENT_VERIFICATION_URL || 'auth/verify-email';


export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const POSTGRES_USER = process.env.POSTGRES_USER;
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
export const POSTGRES_DB = process.env.POSTGRES_DB;
export const POSTGRES_HOST = process.env.POSTGRES_HOST;
export const POSTGRES_PORT = parseInt(process.env.POSTGRES_PORT, 10);
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

