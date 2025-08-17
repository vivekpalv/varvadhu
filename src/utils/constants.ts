import dotenv from 'dotenv';
dotenv.config();

export const APP = {
    PORT: process.env.PORT || 3000,
    DB_URI: process.env.DB_URI || '',
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_EXPIRATION: 60 * 60 * 24 * 30, // in seconds
    BCRYPT_SALT_ROUNDS: 10,
    OTP_LENGTH: 4
} as const;
export const OTP = {
    LENGTH: 4,
    LOGIN_EXPIRY: 3 * 60 * 1000, // in milliseconds
    REGISTER_EXPIRY: 10 * 60 * 1000, // in milliseconds
} as const;

export const CLOUDINARY = {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    API_KEY: process.env.CLOUDINARY_API_KEY,
    API_SECRET: process.env.CLOUDINARY_API_SECRET,
} as const;

export const RATE_LIMIT = {
    WINDOW_IN_MILLIS: 1000 * 60 * 10,
    REQ_PER_WINDOW: 1000,
} as const;