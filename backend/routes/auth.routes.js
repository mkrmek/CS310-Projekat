import express from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { body } from 'express-validator';

const router = express.Router();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Ime je obavezno'),
    body('email').isEmail().withMessage('Email nije ispravan'),
    body('password').isLength({ min: 6 }).withMessage('Šifra mora imati minimum 6 karaktera'),
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email nije ispravan'),
    body('password').notEmpty().withMessage('Šifra je obavezna'),
  ],
  login
);

export default router;
