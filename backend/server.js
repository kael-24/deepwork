import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';

import userRoutes from './routes/userRoutes.js';

const app = express();

const allowedOrigins = [process.env.CLIENT_URL];
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(express.json());

app.use('/api/users', userRoutes);

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