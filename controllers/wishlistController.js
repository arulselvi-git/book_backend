const Wishlist = require('../models/Wishlist');

exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.id }).populate('books');
    res.json(wishlist || { books: [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { bookId } = req.body;
    let wishlist = await Wishlist.findOne({ userId: req.user.id });
    
    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user.id, books: [] });
    }
    
    if (!wishlist.books.includes(bookId)) {
      wishlist.books.push(bookId);
      await wishlist.save();
    }
    
    await wishlist.populate('books');
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;
    const wishlist = await Wishlist.findOne({ userId: req.user.id });
    
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
    
    wishlist.books = wishlist.books.filter(id => id.toString() !== bookId);
    await wishlist.save();
    await wishlist.populate('books');
    
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};