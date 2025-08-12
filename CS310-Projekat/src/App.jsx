import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <div>
      <Navbar />
      <Routes>
        
        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {user?.role === 'admin' && (
          <Route path="/admin" element={<AdminPanel />} />
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;

