import { useState, useEffect } from 'react';
import axios from 'axios';

function KYC() {
  const [formData, setFormData] = useState({ aadhar: '', pan: '' });
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/kyc/status', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStatus(res.data.kyc.status);
      } catch (err) {
        setError(err.response?.data.msg || 'Server error');
      }
    };
    fetchStatus();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append('aadhar', formData.aadhar);
    data.append('pan', formData.pan);
    for (let file of files) {
      data.append('documents', file);
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/kyc', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatus(res.data.kyc.status);
      setFormData({ aadhar: '', pan: '' });
      setFiles([]);
    } catch (err) {
      setError(err.response?.data.msg || 'Server error');
    }
  };

  return (
    <div className="container mx-auto mt-10 max-w-md">
      <h2 className="text-2xl font-bold mb-4">KYC Verification</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {status && <p className="text-green-500 mb-4">Status: {status}</p>}
      <p className="mb-4">Submit KYC details for verification.</p>
      <div className="space-y-4">
        <input
          type="text"
          name="aadhar"
          value={formData.aadhar}
          onChange={handleChange}
          placeholder="Aadhaar Number"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="pan"
          value={formData.pan}
          onChange={handleChange}
          placeholder="PAN Number"
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Submit KYC
        </button>
      </div>
    </div>
  );
}

export default KYC;