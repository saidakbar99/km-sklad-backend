// import express from 'express';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// const app = express();
// app.use(express.json());

// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;

//   // Example: Retrieve user from your database (replace with your own logic)
//   const user = users.find(user => user.username === username);

//   if (!user) {
//     return res.status(400).json({ message: 'Invalid credentials' });
//   }

//   const isMatch = await bcrypt.compare(password, user.password);

//   if (!isMatch) {
//     return res.status(400).json({ message: 'Invalid credentials' });
//   }

//   const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
//     expiresIn: '1h', // Token expiration
//   });

//   // Set the HTTP-only cookie
//   res.cookie('access_token', token, {
//     httpOnly: true,  // Ensures the cookie is not accessible via JavaScript
//     secure: process.env.NODE_ENV === 'production', // Use secure cookie in production (HTTPS)
//     maxAge: 3600000, // Cookie expiration time (1 hour in ms)
//     sameSite: 'Strict', // Prevents CSRF attacks
//   });

//   return res.status(200).json({ message: 'Login successful' });
// });

// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   // Retrieve user from database
//   const isMatch = await bcrypt.compare(password, user.password);
//   if (isMatch) {
//     const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
//     res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });
//     res.status(200).send('Login successful');
//   } else {
//     res.status(401).send('Invalid credentials');
//   }
// });


import express from 'express';
import { login } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);

export default router;