import express from 'express';
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getMonthlyStats, 
} from '../controllers/expense.controller.js';

import { protect } from '../middleware/auth.middleware.js';
import { body } from 'express-validator';

const router = express.Router();


router.get('/', protect, getExpenses);


router.get('/stats', protect, getMonthlyStats);


router.post(
  '/',
  protect,
  [
    body('amount', 'Iznos je obavezan i mora biti broj').isNumeric(),
    body('category', 'Kategorija je obavezna').notEmpty(),
    body('date', 'Datum je obavezan').isISO8601(),
  ],
  createExpense
);


router.put(
  '/:id',
  protect,
  [
    body('amount', 'Iznos mora biti broj').optional().isNumeric(),
    body('category', 'Kategorija ne sme biti prazna').optional().notEmpty(),
    body('date', 'Neispravan datum').optional().isISO8601(),
  ],
  updateExpense
);


router.delete('/:id', protect, deleteExpense);

export default router;


