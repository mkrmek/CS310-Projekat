import express from 'express';
import {
  getUsers,
  getUsersWithExpenses,
  deleteUser,
  updateUserRole,
} from '../controllers/user.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();


router.get('/', protect, adminOnly, getUsers);


router.get('/with-expenses', protect, adminOnly, getUsersWithExpenses);


router.delete('/:id', protect, adminOnly, deleteUser);


router.put('/:id/role', protect, adminOnly, updateUserRole);

export default router;
