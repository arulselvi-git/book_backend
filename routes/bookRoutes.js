const express = require('express');
const router = express.Router();
const { getAllBooks, getBookById, addBook, updateBook, deleteBook } = require('../controllers/bookController');
const verifyToken = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.post('/', verifyToken, adminAuth, addBook);
router.put('/:id', verifyToken, adminAuth, updateBook);
router.delete('/:id', verifyToken, adminAuth, deleteBook);

module.exports = router;
