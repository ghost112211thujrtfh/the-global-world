import { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [tradeForm, setTradeForm] = useState({ userId: '', outcome: 'win', amount: '' });
  const [balanceForm, setBalanceForm] = useState({ userId: '', amount: '', action: 'add' });
  const [kycList, setKycList] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userRes = await axios.get('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(userRes.data);
        const kycRes = await axios.get('/api/kyc', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setKycList(kycRes.data);
      } catch (err) {
        setError(err.response?.data.msg || 'Server error');
      }
    };
    fetchData();
  }, []);

  const handleTradeChange = (e) => {
    setTradeForm({ ...tradeForm, [e.target.name]: e.target.value });
  };

  const handleBalanceChange = (e) => {
    setBalanceForm({ ...balanceForm, [e.target.name]: e.target.value });
  };

  const handleSetTrade = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/admin/trade-control', tradeForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTradeForm({ userId: '', outcome: 'win', amount: '' });
    } catch (err) {
      setError(err.response?.data.msg || 'Server error');
    }
  };

  const handleAdjustBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/admin/balance-adjust', balanceForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBalanceForm({ userId: '', amount: '', action: 'add' });
      const userRes = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(userRes.data);
    } catch (err) {
      setError(err.response?.data.msg || 'Server error');
    }
  };

  const handleKycAction = async (kycId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/admin/kyc/approve', { kycId, status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const kycRes = await axios.get('/api/kyc', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setKycList(kycRes.data);
    } catch (err) {
      setError(err.response?.data.msg || 'Server error');
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Admin Panel - The Global World</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <h3 className="text-xl font-bold mb-2">Users</h3>
      <ul className="space-y-2 mb-6">
        {users.map((user) => (
          <li key={user._id} className="border p-2 rounded">
            ID: {user.userId}, Username: {user.username}, Email: {user.email}, Balance: ₹{user.balance}
          </li>
        ))}
      </ul>
      <h3 className="text-xl font-bold mb-2">Set Trade Outcome</h3>
      <div className="space-y-4 max-w-md mb-6">
        <select
          name="userId"
          value={tradeForm.userId}
          onChange={handleTradeChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>{user.userId} - {user.username}</option>
          ))}
        </select>
        <select
          name="outcome"
          value={tradeForm.outcome}
          onChange={handleTradeChange}
          className="w-full p-2 border rounded"
        >
          <option value="win">Win</option>
          <option value="loss">Loss</option>
        </select>
        <input
          type="number"
          name="amount"
          value={tradeForm.amount}
          onChange={handleTradeChange}
          placeholder="Amount"
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleSetTrade}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Set Trade Outcome
        </button>
      </div>
      <h3 className="text-xl font-bold mb-2">Adjust Balance</h3>
      <div className="space-y-4 max-w-md mb-6">
        <select
          name="userId"
          value={balanceForm.userId}
          onChange={handleBalanceChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>{user.userId} - {user.username}</option>
          ))}
        </select>
        <select
          name="action"
          value={balanceForm.action}
          onChange={handleBalanceChange}
          className="w-full p-2 border rounded"
        >
          <option value="add">Add</option>
          <option value="subtract">Subtract</option>
        </select>
        <input
          type="number"
          name="amount"
          value={balanceForm.amount}
          onChange={handleBalanceChange}
          placeholder="Amount"
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleAdjustBalance}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Adjust Balance
        </button>
      </div>
      <h3 className="text-xl font-bold mb-2">KYC Management</h3>
      <ul className="space-y-2">
        {kycList.map((kyc) => (
          <li key={kyc._id} className="border p-2 rounded">
            User ID: {kyc.userId}, Aadhaar: {kyc.aadhar}, PAN: {kyc.pan}, Status: {kyc.status}
            <div className="mt-2">
              <button
                onClick={() => handleKycAction(kyc._id, 'approved')}
                className="bg-green-500 text-white p-1 rounded mr-2"
              >
                Approve
              </button>
              <button
                onClick={() => handleKycAction(kyc._id, 'rejected')}
                className="bg-red-500 text-white p-1 rounded"
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPanel;