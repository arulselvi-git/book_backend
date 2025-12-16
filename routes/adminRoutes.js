const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Book = require('../models/Book');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// Admin stats endpoint
router.get('/stats', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalBooks = await Book.countDocuments();
    const totalOrders = await Order.countDocuments();

    res.json({
      totalUsers,
      totalBooks,
      totalOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Top selling books endpoint
router.get('/top-selling', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    let topBooks = await Order.aggregate([
      { $group: { _id: '$bookId', totalSold: { $sum: '$quantity' } } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'books', localField: '_id', foreignField: '_id', as: 'book' } },
      { $unwind: '$book' },
      { $project: { _id: 1, totalSold: 1, title: '$book.title', author: '$book.author', price: '$book.price', image: '$book.image' } }
    ]);

    // If no sales data, show famous books based on highest ratings
    if (topBooks.length === 0) {
      let famousBooks = await Book.find({ rating: { $gt: 0 } })
        .sort({ rating: -1, createdAt: -1 })
        .limit(5)
        .select('title author price image rating');
      
      // If no rated books, just show any 5 books
      if (famousBooks.length === 0) {
        famousBooks = await Book.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select('title author price image rating');
      }
      
      topBooks = famousBooks.map(book => ({
        _id: book._id,
        totalSold: 0,
        title: book.title,
        author: book.author,
        price: book.price,
        image: book.image,
        rating: book.rating || 0
      }));
    }

    res.json(topBooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users
router.get('/users', auth, async (req, res) => {
  try {
    console.log('Admin users request from:', req.user.role);
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    console.log('Found users:', users.length);
    res.json(users);
  } catch (error) {
    console.error('Error in /admin/users:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;