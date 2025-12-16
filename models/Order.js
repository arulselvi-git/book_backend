const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  quantity: { type: Number, default: 1 },
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  orderDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'ordered', enum: ['ordered', 'packed', 'shipped', 'delivered', 'cancelled', 'completed'] },
  statusHistory: [{
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    message: { type: String }
  }],
  paymentMethod: { type: String, default: 'cod', enum: ['cod', 'upi', 'gpay', 'card'] },
  paymentStatus: { type: String, default: 'unpaid', enum: ['paid', 'unpaid'] },
  review: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
    reviewDate: { type: Date }
  }
});

module.exports = mongoose.model('Order', orderSchema);
