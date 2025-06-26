import { useState } from 'react';
import axios from 'axios';

function Transaction() {
  const [type, setType] = useState('deposit');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = type === 'deposit' ? '/api/deposit' : '/api/withdraw';
      const res = await axios.post(endpoint, { amount: parseFloat(amount) }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(res.data.msg);
      setAmount('');
    } catch (err) {
      setError(err.response?.data.msg || 'Server error');
    }
  };

  return (
    <div className="container mx-auto mt-10 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Transactions</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {message && <p className="text-green-500 mb-4">{message}</p>}
      <p className="mb-4">Contact support for payment processing.</p>
      <div className="space-y-4">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="deposit">Deposit</option>
          <option value="withdraw">Withdraw</option>
        </select>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Submit Request
        </button>
      </div>
    </div>
  );
}

export default Transaction;