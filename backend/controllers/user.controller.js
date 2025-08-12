import User from '../models/User.js';
import Expense from '../models/Expense.js';


export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const users = await User.find()
      .select('-password')
      .sort(sort.split(',').join(' '))
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments();

    res.json({
      data: users,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Greška pri učitavanju korisnika.' });
  }
};


export const getUsersWithExpenses = async (req, res) => {
  try {
    const users = await User.find().select('-password').lean();

    const usersWithExpenses = await Promise.all(
      users.map(async (user) => {
        const expenses = await Expense.find({ user: user._id }).lean();
        return { ...user, expenses };
      })
    );

    res.json(usersWithExpenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška pri dohvatanju korisnika i njihovih troškova.' });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }

    
    await Expense.deleteMany({ user: req.params.id });

    res.json({ message: 'Korisnik i njegovi troškovi su uspešno obrisani.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Greška prilikom brisanja korisnika.' });
  }
};


export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Nevažeća rola. Dozvoljeno: user, admin.' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }

    res.json({ message: 'Rola korisnika uspešno ažurirana.', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Greška pri ažuriranju uloge korisnika.' });
  }
};
