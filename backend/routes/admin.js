const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const Trade = require('../models/Trade');
const KYC = require('../models/KYC');

router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/trade-control', auth, adminAuth, async (req, res) => {
  const { userId, outcome, amount } = req.body;
  try {
    const trade = new Trade({
      userId,
      amount,
      outcome,
      adminOverride: true,
      status: 'pending',
    });
    await trade.save();
    res.json({ msg: 'Trade outcome set for The Global World', trade });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/balance-adjust', auth, adminAuth, async (req, res) => {
  const { userId, amount, action } = req.body; // action: 'add' or 'subtract'
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (action === 'add') {
      user.balance += parseFloat(amount);
    } else if (action === 'subtract') {
      if (user.balance < amount) return res.status(400).json({ msg: 'Insufficient balance' });
      user.balance -= parseFloat(amount);
    } else {
      return res.status(400).json({ msg: 'Invalid action' });
    }
    user.updatedAt = Date.now();
    await user.save();
    res.json({ msg: 'Balance adjusted', balance: user.balance });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/kyc/approve', auth, adminAuth, async (req, res) => {
  const { kycId, status } = req.body; // status: 'approved' or 'rejected'
  try {
    const kyc = await KYC.findById(kycId);
    if (!kyc) return res.status(404).json({ msg: 'KYC not found' });

    kyc.status = status;
    await kyc.save();
    res.json({ msg: `KYC ${status}`, kyc });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;