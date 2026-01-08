import 'dotenv/config';
/**
 * Environment Configuration
 * Centralized environment variable validation and constants
 */

const requiredEnvVars = [
    'MONGO_URI',
    'JWT_SECRET',
    'CLIENT_URL',
    'IS_DEV',
    'RESEND_API_KEY',
    'RESET_PASSWORD_URL',
    'FIREBASE_SERVICE_ACCOUNT',
];

/**
 * Validate all required environment variables are set
 */
export const validateEnv = () => {
    const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
};

/**
 * Get environment configuration
 */
export const getEnvConfig = () => ({
    // CRUCIAL
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
    IS_DEV: process.env.IS_DEV === 'true',
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESET_PASSWORD_URL: process.env.RESET_PASSWORD_URL,
    FIREBASE_SERVICE_ACCOUNT: process.env.FIREBASE_SERVICE_ACCOUNT,
    // UNLISTED
    PORT: process.env.PORT || 5000,
});
