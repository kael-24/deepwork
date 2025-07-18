import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
dotenv.config();
const app = express();

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