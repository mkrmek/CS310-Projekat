import React, { useEffect, useState } from 'react';
import '../App.css';

const rsd = (n) => Number(n || 0).toLocaleString('sr-RS', { style: 'currency', currency: 'RSD' });

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ title: '', amount: '', category: '' });
  const [total, setTotal] = useState(0);
  const [editingId, setEditingId] = useState(null);

  const fetchExpenses = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/expenses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const result = await res.json();
        setExpenses(result.data || []);

        
        const serverTotal = result.totalAmount;
        const clientTotal = (result.data || []).reduce((s, e) => s + Number(e.amount || 0), 0);
        setTotal(typeof serverTotal === 'number' ? serverTotal : clientTotal);
      } else {
        console.error('Neuspešno dohvaćanje troškova');
      }
    } catch (err) {
      console.error('Greška pri fetchExpenses:', err);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('token')) fetchExpenses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'amount' ? value.replace(',', '.') : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingId
      ? `http://localhost:5000/api/expenses/${editingId}`
      : 'http://localhost:5000/api/expenses';
    const method = editingId ? 'PUT' : 'POST';

    
    const payload = {
      ...form,
      amount: Number(form.amount),
      title: form.title.trim(),
      category: form.category,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setForm({ title: '', amount: '', category: '' });
        setEditingId(null);
        fetchExpenses();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.message || 'Neuspešno dodavanje/izmena troška.');
      }
    } catch (err) {
      console.error('Greška pri slanju forme:', err);
    }
  };

  const handleEdit = (exp) => {
    setForm({
      title: exp.title,
      amount: String(exp.amount),
      
      category: typeof exp.category === 'object' ? exp.category._id : exp.category,
    });
    setEditingId(exp._id);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/expenses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.ok) fetchExpenses();
    } catch (err) {
      console.error('Greška pri brisanju troška:', err);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Moji troškovi</h2>
      <p><strong>Ukupna potrošnja:</strong> {rsd(total)}</p>

      <form className="expense-form" onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Naslov troška"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          name="amount"
          type="number"
          step="0.01"
          placeholder="Iznos"
          value={form.amount}
          onChange={handleChange}
          required
        />
        <input
          name="category"
          placeholder="Kategorija (npr. Hrana, Računi)"
          value={form.category}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {editingId ? 'Sačuvaj izmene' : 'Dodaj trošak'}
        </button>
      </form>

      <table className="expense-table">
        <thead>
          <tr>
            <th>Naslov</th>
            <th>Iznos</th>
            <th>Kategorija</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(expenses) && expenses.map((exp) => (
            <tr key={exp._id}>
              <td>{exp.title}</td>
              <td>{rsd(exp.amount)}</td>
              <td>{typeof exp.category === 'object' ? exp.category.name : exp.category}</td>
              <td>
                <button onClick={() => handleEdit(exp)} className="edit-btn">Izmeni</button>
                <button onClick={() => handleDelete(exp._id)} className="delete-btn">Obriši</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
