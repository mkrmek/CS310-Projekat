import jwt from 'jsonwebtoken';
import User from '../models/User.js';


export const protect = async (req, res, next) => {
  let token;

  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      
      token = req.headers.authorization.split(' ')[1];

      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

     
      req.user = await User.findById(decoded.id).select('-password');

      next(); 
    } catch (err) {
      return res.status(401).json({ message: 'Niste autorizovani (nevalidan token).' });
    }
  } else {
    res.status(401).json({ message: 'Niste autorizovani (nema tokena).' });
  }
};


export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); 
  } else {
    res.status(403).json({ message: 'Pristup dozvoljen samo administratorima.' });
  }
};

