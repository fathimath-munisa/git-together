import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import connectionsRoutes from './routes/connections.js';
import userRoutes from './routes/user.js';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
)

app.use('/', authRoutes);
app.use('/', profileRoutes);
app.use('/', connectionsRoutes);
app.use('/', userRoutes);

connectDB().then(() => {
    console.log("Connected to the database");
    app.listen(PORT, () => {
      console.log('Server is running on port 5000');
    })
}).catch((err) => {
    console.error("Failed to connect to the database", err);
})


