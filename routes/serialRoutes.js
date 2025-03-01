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
  createSupermarketSerial,
  getLastInvoiceNumber,
  createInvoice,
  getUserSeh,
  getInvoices,
  deleteInvoice,
  updateInvoice,
  getOneInvoice,
  getAllUniquesOfInvoice,
  recieveInvoice,
  getInvoiceHistories,
  getAllStorage,
  getStorageBlocks,
  updateStorageBlocks,
  login,
  getInvoiceUsers
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
router.post('/serials', getSerials)

//Nakladnoy 
router.get('/invoice', getInvoices)
router.get('/invoice-history', getInvoiceHistories)
router.get('/invoice-uniques', getAllUniquesOfInvoice)
router.get('/invoice/:id', getOneInvoice)
router.delete('/invoice', deleteInvoice)
router.put('/invoice', updateInvoice)
router.post('/invoice-creation', createInvoice)
router.get('/last-invoice', getLastInvoiceNumber)
router.post('/seh', getUserSeh)

//Sklad
router.post('/invoice-recieve', recieveInvoice)
router.get('/storage', getAllStorage)
router.get('/storage-blocks', getStorageBlocks)
router.put('/storage-blocks', updateStorageBlocks)

//Auth
router.post('/login', login);
router.get('/users', getInvoiceUsers);

export default router;