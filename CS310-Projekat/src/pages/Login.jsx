import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.token); 
        navigate('/dashboard'); 
      } else {
        alert(data.message || 'Greška pri prijavi');
      }
    } catch (err) {
      console.error('Greška pri loginu:', err);
      alert('Došlo je do greške');
    }
  };

  return (
  <div className="form-container">
    <form onSubmit={handleSubmit} className="form">
      <h2>Prijava</h2>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Lozinka"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Prijavi se</button>
    </form>
  </div>
);
};

export default Login;