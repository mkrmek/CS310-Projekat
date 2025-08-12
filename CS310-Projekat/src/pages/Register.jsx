import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      alert('Uspešna registracija!');
      navigate('/login');
    } else {
      alert(data.message);
    }
  };

  return (
  <div className="form-container">
    <form onSubmit={handleSubmit} className="form">
      <h2>Registracija</h2>
      <input
        name="name"
        placeholder="Ime"
        onChange={handleChange}
        required
      />
      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />
      <input
        name="password"
        placeholder="Lozinka"
        type="password"
        onChange={handleChange}
        required
      />
      <button type="submit">Registruj se</button>
    </form>
  </div>
);

};

export default Register;
