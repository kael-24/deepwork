import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import cookieParser from 'cookie-parser';

import userAuthRoutes from './routes/userAuthRoutes.js';
import workoutRoutes from './routes/workoutRoutes.js'

const app = express();

/**
 * ---------------------------------------------------------
 * CORS MIDDLEWARE - restricting the frontend link that can connect 
 * ---------------------------------------------------------
 */
const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:5173']; // only the client url can connect to the backend
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


/**
 * ---------------------------------------------------------
 * CONVERTS HTTPS TO JSON
 * ---------------------------------------------------------
 */
app.use(express.json());

/**
 * ---------------------------------------------------------
 * reads and parse any incoming cookies attached to HTTP request, so that they're available in req.cookies
 * ---------------------------------------------------------
 */
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
 * DATABASE AND PORT CONNECTIONS
 * ---------------------------------------------------------
 */
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('DB SUCCESSFULLY CONNECTED == 5000') // TEMPDEV
        });
    })
    .catch((error) => {
        console.log('DATABASE CONNECTION FAILED'); // TEMPDEV
        console.log(error);
    })