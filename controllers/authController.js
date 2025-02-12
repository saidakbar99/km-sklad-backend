import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../utils/generateToken.js';

const prisma = new PrismaClient();

// export const login = async (req, res) => {
//   const { username, password } = req.body;

//   const user = await prisma.user.findFirst({ where: { username } });
//   if (!user) {
//     return res.status(400).json({ message: 'Invalid credentials' });
//   }

//   const isMatch = bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     return res.status(400).json({ message: 'Invalid credentials' });
//   }

//   const token = generateToken(user.id, user.role);

//   res.cookie('token', token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict',
//   });

//   res.json({ message: 'Login successful' });
// };

export const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findFirst({ where: { username } });
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isMatch = bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user.id, user.role);

  res.json({ token, user, message: 'Login successful' });
};