import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });


const validatorMsg = (errors) =>
  errors.array().map((e) => ({ field: e.param, msg: e.msg }));

export const register = async (req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: validatorMsg(errors) });
  }

 
  let { name, email, password } = req.body;
  email = email?.trim().toLowerCase();
  
  if (typeof password === 'string') password = password.trim();
  if (typeof name === 'string') name = name.trim();

  try {
    
    const exists = await User.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .json({ message: 'Korisnik sa ovom email adresom već postoji.' });
    }

    
    const user = new User({ name, email, password });
    await user.save();

    
    const token = generateToken(user);
    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    
    if (err?.code === 11000) {
      return res
        .status(400)
        .json({ message: 'Korisnik sa ovom email adresom već postoji.' });
    }
    console.error('REGISTER error:', err);
    return res
      .status(500)
      .json({ message: 'Greška pri registraciji korisnika.' });
  }
};

export const login = async (req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: validatorMsg(errors) });
  }

  
  let { email, password } = req.body;
  email = email?.trim().toLowerCase();
  if (typeof password === 'string') password = password.trim();

  try {
    
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Neispravan email ili šifra.' });
    }

   
    const ok = await user.matchPassword(password ?? '');
    if (!ok) {
      return res
        .status(400)
        .json({ message: 'Neispravan email ili šifra.' });
    }

    
    const token = generateToken(user);
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('LOGIN error:', err);
    return res.status(500).json({ message: 'Greška pri prijavi korisnika.' });
  }
};
