import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';


import authRoutes from './routes/auth.routes.js';
import expenseRoutes from './routes/expense.routes.js';
import categoryRoutes from './routes/category.routes.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();


app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json()); 


app.use('/api/auth', authRoutes);         
app.use('/api/expenses', expenseRoutes);  
app.use('/api/categories', categoryRoutes); 
app.use('/api/users', userRoutes);        


app.get('/', (req, res) => {
  res.send('API radi ✔️');
});


const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB povezan');
    app.listen(PORT, () => console.log(`🚀 Server radi na portu ${PORT}`));
  })
  .catch((err) => console.error('❌ Greška pri povezivanju sa MongoDB:', err));
