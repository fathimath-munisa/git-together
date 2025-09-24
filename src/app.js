import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/auth', authRoutes);

connectDB().then(() => {
    console.log("Connected to the database");
    app.listen(PORT, () => {
      console.log('Server is running on port 5000');
    })
}).catch((err) => {
    console.error("Failed to connect to the database", err);
})


