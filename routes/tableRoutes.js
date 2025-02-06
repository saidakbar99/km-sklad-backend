import express from 'express';
import { authenticateToken, checkRole } from '../middleware/authMiddleware.js';
import { getTables, createTable } from '../controllers/tableController.js';

const router = express.Router();

router.get('/tables', authenticateToken, getTables);
router.post('/tables', authenticateToken, checkRole('admin'), createTable);

export default router;