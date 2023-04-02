const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  status: {
    type: String,
    enum: ['PENDING', 'SUCCESS'],
    required: [true, 'Status is required'],
    default: 'PENDING',
  },
  invoice: {
    type: String,
  },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
