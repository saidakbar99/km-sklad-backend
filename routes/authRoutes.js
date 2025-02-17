import express from 'express';
import { login, getInvoiceUsers } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.get('/users', getInvoiceUsers);

export default router;