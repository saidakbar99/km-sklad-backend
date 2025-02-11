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
app.use(cors({ origin: 'https://km-sklad.netlify.app', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use('/api', serialRoutes);

prisma.$connect()
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

app.listen(5000, () => {
  console.log('Server running on PORT 5000');
});