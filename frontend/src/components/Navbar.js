import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      const user = JSON.parse(atob(token.split('.')[1])).user;
      setIsAdmin(user.isAdmin);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate('/login');
  };

  const openSupportChat = () => {
    alert('Contact customer support for payment or transaction queries.');
    // Placeholder for live chat integration (e.g., with third-party service like Tawk.to)
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">The Global World</Link>
        <div className="space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/trade" className="hover:underline">Trade</Link>
              <Link to="/transaction" className="hover:underline">Transactions</Link>
              <Link to="/kyc" className="hover:underline">KYC</Link>
              {isAdmin && <Link to="/admin" className="hover:underline">Admin Panel</Link>}
              <button onClick={handleLogout} className="hover:underline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          )}
        </div>
      </div>
      <button className="support-chat" onClick={openSupportChat}>Support Chat</button>
    </nav>
  );
}

export default Navbar;