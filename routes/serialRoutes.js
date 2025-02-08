import express from 'express';
import { 
  demand,
  demandFurniture,
  furniture,
  categoryFurniture,
  setFurniture,
  unique,
  vipusk,
  getSerials,
  getAllFurnitureCategories,
  getFurnitureSets,
  getFurnitures,
  getColors,
  getTrees,
  createSupermarketSerial
} from '../controllers/serialController.js';

const router = express.Router();

// Client Serial Generation
router.post('/demand', demand);
router.post('/demand-furniture', demandFurniture)
router.post('/furniture', furniture)
router.post('/category-furniture', categoryFurniture)
router.post('/set-furniture', setFurniture)
router.put('/unique', unique)
router.post('/vipusk', vipusk)

// Store Serial Generation
router.get('/categories', getAllFurnitureCategories)
router.get('/trees', getTrees)
router.get('/colors', getColors)
router.post('/set', getFurnitureSets)
router.post('/furnitures', getFurnitures)
router.post('/supermarket-generation', createSupermarketSerial)

// Serials
router.get('/serials', getSerials)

export default router;