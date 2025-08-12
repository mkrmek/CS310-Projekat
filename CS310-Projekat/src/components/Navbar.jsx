import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav>
      <Link to="/">Početna</Link>
      {user ? (
        <>
          {user.role === 'admin' && <Link to="/admin">Admin</Link>}
          <button onClick={logout}>Odjava</button>
        </>
      ) : (
        <>
          <Link to="/login">Prijava</Link>
          <Link to="/register">Registracija</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
