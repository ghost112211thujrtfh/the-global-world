import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Trade from './components/Trade';
import Transaction from './components/Transaction';
import KYC from './components/KYC';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/transaction" element={<Transaction />} />
          <Route path="/kyc" element={<KYC />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/" element={<h1 className="text-center mt-10 text-3xl">Welcome to The Global World Trading Platform</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;