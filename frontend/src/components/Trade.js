import { useState, useEffect } from 'react';
import axios from 'axios';

function Trade() {
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [trades, setTrades] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userRes = await axios.get('/api/auth/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBalance(userRes.data.balance);
        const tradeRes = await axios.get('/api/trade', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrades(tradeRes.data);
      } catch (err) {
        setError(err.response?.data.msg || 'Server error');
      }
    };
    fetchData();
  }, []);

  const handleTrade = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/trade', { amount: parseFloat(amount) }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrades([res.data.trade, ...trades]);
      setBalance(res.data.balance);
      setAmount('');
    } catch (err) {
      setError(err.response?.data.msg || 'Server error');
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Trade on The Global World</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <p className="mb-4">Balance: ₹{balance}</p>
      <div className="mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Trade Amount"
          className="p-2 border rounded mr-2"
        />
        <button
          onClick={handleTrade}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Place Trade
        </button>
      </div>
      <h3 className="text-xl font-bold mb-2">Trade History</h3>
      <ul className="space-y-2">
        {trades.map((trade) => (
          <li key={trade._id} className="border p-2 rounded">
            Amount: ₹{trade.amount}, Outcome: {trade.outcome}, Status: {trade.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Trade;