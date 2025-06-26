const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Trade = require('../models/Trade');
const User = require('../models/User');

router.post('/', auth, async (req, res) => {
  const { amount } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (user.balance < amount) {
      return res.status(400).json({ msg: 'Insufficient balance' });
    }

    const adminTrade = await Trade.findOne({
      userId: req.user.id,
      adminOverride: true,
      status: 'pending',
    });

    let outcome;
    if (adminTrade) {
      outcome = adminTrade.outcome;
      adminTrade.status = 'completed';
      await adminTrade.save();
    } else {
      outcome = Math.random() > 0.5 ? 'win' : 'loss';
    }

    const trade = new Trade({
      userId: req.user.id,
      amount,
      outcome,
      status: 'completed',
    });
    await trade.save();

    if (outcome === 'win') {
      user.balance += parseFloat(amount);
    } else {
      user.balance -= parseFloat(amount);
    }
    await user.save();

    res.json({ trade, balance: user.balance });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;