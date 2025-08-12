import Category from '../models/Category.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Greška pri učitavanju kategorija.' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    const saved = await category.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: 'Neuspešno kreiranje kategorije.' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(category);
  } catch (err) {
    res.status(400).json({ message: 'Neuspešno ažuriranje kategorije.' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Kategorija obrisana.' });
  } catch (err) {
    res.status(400).json({ message: 'Greška pri brisanju kategorije.' });
  }
};
