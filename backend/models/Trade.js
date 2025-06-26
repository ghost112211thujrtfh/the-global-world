const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  asset: String,
  amount: Number,
  type: String,
  status: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trade', tradeSchema);
