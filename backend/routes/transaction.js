const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

router.post('/deposit', auth, async (req, res) => {
  const { amount } = req.body;
  try {
    const transaction = new Transaction({
      userId: req.user.id,
      type: 'deposit',
      amount: parseFloat(amount),
      status: 'pending',
    });
    await transaction.save();
    res.json({ msg: 'Deposit request submitted. Contact customer support for approval.', transaction });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/withdraw', auth, async (req, res) => {
  const { amount } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (user.balance < amount) {
      return res.status(400).json({ msg: 'Insufficient balance' });
    }

    const transaction = new Transaction({
      userId: req.user.id,
      type: 'withdraw',
      amount: parseFloat(amount),
      status: 'pending',
    });
    await transaction.save();
    res.json({ msg: 'Withdrawal request submitted. Contact customer support for approval.', transaction });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;