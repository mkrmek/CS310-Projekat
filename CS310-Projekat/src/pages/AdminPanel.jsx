import React, { useEffect, useState } from 'react';

const AdminPanel = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [users, setUsers] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/categories', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Greška pri dohvaćanju kategorija:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/expenses/stats', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setMonthlyStats(data);
    } catch (err) {
      console.error('Greška pri dohvatanju statistike:', err);
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const res = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name: newCategory }),
      });

      if (!res.ok) {
        throw new Error('Dodavanje kategorije nije uspelo');
      }

      setNewCategory('');
      fetchCategories();
    } catch (err) {
      console.error('Greška pri dodavanju kategorije:', err);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchCategories();
    } catch (err) {
      console.error('Greška pri brisanju kategorije:', err);
    }
  };

  const deleteUser = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) throw new Error('Brisanje nije uspelo');
      loadUsers();
    } catch (err) {
      console.error('Greška pri brisanju korisnika:', err);
    }
  };

  const changeUserRole = async (id, newRole) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error('Promena uloge nije uspela');
      loadUsers();
    } catch (err) {
      console.error('Greška pri promeni uloge korisnika:', err);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/users/with-expenses', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!res.ok) {
        throw new Error('Greška prilikom dohvatanja korisnika');
      }

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Greška u loadUsers:', err);
      setError('Ne mogu da učitam korisnike. Proveri da li je backend pokrenut i da li ruta postoji.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    loadUsers();
    fetchStats();
  }, []);

  return (
    <div className="page" style={{ padding: '40px' }}>
      <h2>Admin Panel - Upravljanje kategorijama</h2>

      <div style={{ maxWidth: '400px', margin: '20px auto' }}>
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Nova kategorija"
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            marginBottom: '10px',
          }}
        />
        <button
          onClick={addCategory}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
          }}
        >
          Dodaj
        </button>
      </div>

      <table style={{ width: '100%', marginBottom: '40px' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Naziv</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td>{cat.name}</td>
              <td>
                <button
                  onClick={() => deleteCategory(cat._id)}
                  style={{
                    backgroundColor: 'crimson',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Obriši
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Pregled korisnika i njihovih troškova</h2>

      {loading && <p>Učitavam korisnike...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {users.map((u) => (
        <div
          key={u._id}
          className="user-box"
          style={{
            marginBottom: '20px',
            backgroundColor: '#fff',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 0 5px rgba(0,0,0,0.1)',
          }}
        >
          <h4>
            {u.name} ({u.email})
          </h4>
          <p>Uloga: {u.role}</p>

          <div style={{ marginBottom: '10px' }}>
            <label>Promeni ulogu: </label>
            <select value={u.role} onChange={(e) => changeUserRole(u._id, e.target.value)}>
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>

          <button
            onClick={() => deleteUser(u._id)}
            style={{ backgroundColor: 'darkred', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '5px' }}
          >
            Obriši korisnika
          </button>

          <ul>
            {u.expenses && u.expenses.length > 0 ? (
              u.expenses.map((e) => (
                <li key={e._id}>
                  {e.category} – {e.amount} RSD – {e.date?.substring(0, 10)}
                </li>
              ))
            ) : (
              <li style={{ fontStyle: 'italic', color: 'gray' }}>
                Nema troškova
              </li>
            )}
          </ul>
        </div>
      ))}

      <div style={{ marginTop: '40px' }}>
        <h2>Statistika troškova po mesecima</h2>
        {monthlyStats.length === 0 ? (
          <p>Nema dostupne statistike.</p>
        ) : (
          <ul>
            {monthlyStats.map((item) => (
              <li key={`${item._id.month}-${item._id.year}`}>
                {item._id.month}/{item._id.year} – {item.totalAmount} RSD
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
