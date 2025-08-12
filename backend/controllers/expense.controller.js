import Expense from '../models/Expense.js';

export const getExpenses = async (req, res) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const sort = String(req.query.sort ?? '-date').split(',').join(' ');

    const [expenses, count, sumAgg] = await Promise.all([
      Expense.find({ user: req.user._id })
        .populate('category', 'name')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit),
      Expense.countDocuments({ user: req.user._id }),
      Expense.aggregate([
        { $match: { user: req.user._id } },
        { $group: { _id: null, sum: { $sum: '$amount' } } },
      ]),
    ]);

    const totalAmount = sumAgg[0]?.sum ?? 0;

    res.json({
      data: expenses,
      count,                 
      totalAmount,          
      page,
      pages: Math.ceil(count / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Greška pri učitavanju troškova.' });
  }
};



export const createExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    if (!title || amount == null || !category) {
      return res.status(400).json({ message: 'Sva polja su obavezna.' });
    }

    const amountNum = Number(amount);
    if (!Number.isFinite(amountNum)) {
      return res.status(400).json({ message: 'Iznos mora biti broj.' });
    }

    const expense = new Expense({
      title: title.trim(),
      amount: amountNum,
      category,
      date: date || new Date(),
      user: req.user._id,
    });

    const saved = await expense.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Neuspešno kreiranje troška.' });
  }
};



export const updateExpense = async (req, res) => {
  try {
    const updated = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Trošak nije pronađen.' });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Neuspešno ažuriranje troška.' });
  }
};


export const deleteExpense = async (req, res) => {
  try {
    const deleted = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Trošak nije pronađen.' });
    }

    res.json({ message: 'Trošak je uspešno obrisan.' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Greška pri brisanju troška.' });
  }
};


export const getMonthlyStats = async (req, res) => {
  try {
    const stats = await Expense.aggregate([
      {
        $match: { user: req.user._id },
      },
      {
        $group: {
          _id: { $month: "$date" },
          total: { $sum: "$amount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const months = [
      "Januar", "Februar", "Mart", "April", "Maj", "Jun",
      "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"
    ];

    const result = stats.map(item => ({
      month: months[item._id - 1],
      total: item.total,
    }));

    res.json(result);
  } catch (err) {
    console.error('Greška pri dohvatanju statistike:', err);
    res.status(500).json({ message: 'Greška pri statistici troškova.' });
  }
};
