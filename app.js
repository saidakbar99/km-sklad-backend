import 'dotenv/config'
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import serialRoutes from './routes/serialRoutes.js';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

// Middleware
// app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cors({ 
  origin: ['https://km-sklad.netlify.app', 'http://localhost:3000'], 
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use('/api', serialRoutes);

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected');

    app.listen(5000, () => {
      console.log('Server running on PORT 5000');
    });
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1); // Exit process on failure
  }
};

startServer();

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Database disconnected');
  process.exit(0);
});
