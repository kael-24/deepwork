import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { envConfig, connectDB } from './config';
import { errorHandler } from './middleware/errorHandler.js';

import userAuthRoutes from './routes/userAuthRoutes.js';
import workoutRoutes from './routes/workoutRoutes.js'

envConfig.validateEnv();

const app = express();

/**
 * ---------------------------------------------------------
 * CORS MIDDLEWARE - restricting the frontend link that can connect 
 * ---------------------------------------------------------
 */
const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:5173'];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Parse cookies
app.use(cookieParser());

/**
 * ---------------------------------------------------------
 * MAIN ROUTES
 * ---------------------------------------------------------
 */
app.use('/api/auth', userAuthRoutes);
app.use('/api/workouts', workoutRoutes)

/**
 * ---------------------------------------------------------
 * ERROR HANDLING MIDDLEWARE - should be last
 * ---------------------------------------------------------
 */
app.use(errorHandler);

/**
 * ---------------------------------------------------------
 * START SERVER
 * ---------------------------------------------------------
 */
const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on PORT: ${PORT}`);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();