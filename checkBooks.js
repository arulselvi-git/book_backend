const mongoose = require('mongoose');
require('dotenv').config();

const Book = require('./models/Book');

async function checkBooks() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const books = await Book.find().limit(5);
    console.log('First 5 books:');
    books.forEach((book, i) => {
      console.log(`${i+1}. ${book.title}`);
      console.log(`   Image: ${book.image}`);
      console.log(`   Stock: ${book.stock}`);
      console.log('');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkBooks();