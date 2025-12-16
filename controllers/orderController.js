const Order = require('../models/Order');
const Book = require('../models/Book');

/* ======================
   PLACE ORDER
====================== */
exports.placeOrder = async (req, res) => {
  try {
    const {
      bookId,
      quantity = 1,
      shippingAddress,
      paymentMethod = 'cod',
      paymentStatus = 'unpaid'
    } = req.body;

    if (!bookId) {
      return res.status(400).json({ message: 'Book ID is required' });
    }

    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({ message: 'Complete shipping address is required' });
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // 🔻 Reduce stock
    book.stock -= quantity;
    await book.save();

    const order = await Order.create({
      userId: req.user.id,
      bookId: book._id,
      quantity,
      totalAmount: book.price * quantity,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      status: 'ordered',
      statusHistory: [
        {
          status: 'ordered',
          timestamp: new Date(),
          message: 'Order placed successfully'
        }
      ]
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('bookId', 'title author price image category')
      .populate('userId', 'name email');

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/* ======================
   USER ORDERS
====================== */
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate({
        path: 'bookId',
        select: 'title author price image category',
        options: { strictPopulate: false }
      })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/* ======================
   ADMIN – ALL ORDERS
====================== */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: 'bookId',
        select: 'title author price image category',
        options: { strictPopulate: false }
      })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
