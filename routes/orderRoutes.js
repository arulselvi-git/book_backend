const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Book = require('../models/Book');

// Create order
router.post('/', auth, async (req, res) => {
  try {
    const { bookId, quantity = 1, shippingAddress, paymentMethod = 'cod', paymentStatus = 'unpaid' } = req.body;
    
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const totalAmount = book.price * quantity;

    const order = new Order({
      userId: req.user.id,
      bookId,
      quantity,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      status: 'ordered',
      statusHistory: [{
        status: 'ordered',
        timestamp: new Date(),
        message: 'Order placed successfully'
      }]
    });

    await order.save();
    
    // Update book stock
    book.stock -= quantity;
    await book.save();

    await order.populate('bookId');
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user orders
router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('bookId')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all orders (admin only)
router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('bookId')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Cancel order
router.put('/cancel/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (order.status === 'delivered' || order.status === 'cancelled' || order.status === 'shipped') {
      return res.status(400).json({ message: 'Cannot cancel this order' });
    }

    order.status = 'cancelled';
    order.statusHistory.push({
      status: 'cancelled',
      timestamp: new Date(),
      message: 'Order cancelled by user'
    });
    
    await order.save();

    // Restore book stock
    const book = await Book.findById(order.bookId);
    if (book) {
      book.stock += order.quantity;
      await book.save();
    }

    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add review to delivered order
router.post('/:id/review', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({ message: 'Can only review delivered orders' });
    }

    if (order.review) {
      return res.status(400).json({ message: 'Order already reviewed' });
    }

    order.review = {
      rating,
      comment,
      reviewDate: new Date()
    };
    
    await order.save();
    res.json({ message: 'Review submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;