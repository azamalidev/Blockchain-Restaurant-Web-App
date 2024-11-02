const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  food: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true }],
  orderDate: { type: Date, default: Date.now },
  status: { type: String, default: 'Pending' },
  from: String,
  amount : String,
  createdAt: { type: Date, default: Date.now }   
});

module.exports = mongoose.model('Order', orderSchema);
