const mongoose = require('mongoose');
require('dotenv').config();
const Book = require('./models/Book');

const books = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    price: 499,
    category: 'Fiction',
    stock: 25,
    image: 'https://akshardhara.com/cdn/shop/files/TheGreatGateby-F.jpg?v=1743480325',
    description: 'Classic American novel'
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    price: 599,
    category: 'Fiction',
    stock: 0,
    image: 'https://m.media-amazon.com/images/I/71t2jj68CXL._AC_UF1000,1000_QL80_.jpg',
    description: 'Racial injustice in the Deep South'
  },
  {
    title: '1984',
    author: 'George Orwell',
    price: 699,
    category: 'Science Fiction',
    stock: 0,
    image: 'https://rukminim2.flixcart.com/image/480/640/xif0q/book/v/v/f/1984-original-imahc9p42zyurth5.jpeg?q=90',
    description: 'Dystopian novel'
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    price: 549,
    category: 'Romance',
    stock: 35,
    image: 'https://rukminim2.flixcart.com/image/480/640/kkec4280/book/d/h/d/pride-prejudice-original-imafzra6pfewjjwb.jpeg?q=90',
    description: 'Romantic classic'
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    price: 629,
    category: 'Fiction',
    stock: 15,
    image: 'https://m.media-amazon.com/images/I/7108sdEUEGL.jpg',
    description: 'Teenage rebellion'
  },
  {
    title: 'Harry Potter and the Sorcerer Stone',
    author: 'J.K. Rowling',
    price: 799,
    category: 'Fantasy',
    stock: 40,
    image: 'https://rukminim2.flixcart.com/image/480/640/xif0q/book/6/t/7/harry-potter-and-the-sorcerer-s-stone-book-1-original-imah9b3wjbvvq2wf.jpeg?q=90',
    description: 'Wizarding world begins'
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    price: 649,
    category: 'Fantasy',
    stock: 0,
    image: 'https://m.media-amazon.com/images/I/71jD4jMityL._AC_UF1000,1000_QL80_.jpg',
    description: 'Bilbo Baggins adventure'
  },
  {
    title: 'The Da Vinci Code',
    author: 'Dan Brown',
    price: 579,
    category: 'Mystery',
    stock: 22,
    image: 'https://m.media-amazon.com/images/I/71y4X5150dL.jpg',
    description: 'Mystery thriller'
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    price: 449,
    category: 'Philosophy',
    stock: 0,
    image: 'https://m.media-amazon.com/images/I/81ZtAPCqyGL._AC_UF1000,1000_QL80_.jpg',
    description: 'Follow your dreams'
  },
  {
    title: 'Think and Grow Rich',
    author: 'Napoleon Hill',
    price: 399,
    category: 'Self-Help',
    stock: 18,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_pG-lMkI_7fjDtKffPvv6OEB1-teA2bRT8A&s',
    description: 'Success mindset'
  },

  {
    title: 'Atomic Habits',
    author: 'James Clear',
    price: 699,
    category: 'Self-Help',
    stock: 45,
    image: 'https://m.media-amazon.com/images/I/817HaeblezL._AC_UF1000,1000_QL80_.jpg',
    description: 'Build good habits'
  },
  {
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    price: 549,
    category: 'Finance',
    stock: 27,
    image: 'https://m.media-amazon.com/images/I/71XEsXS5RlL.jpg',
    description: 'Money mindset'
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    price: 799,
    category: 'Science Fiction',
    stock: 24,
    image: 'https://m.media-amazon.com/images/I/71oO1E-XPuL.jpg',
    description: 'Epic sci-fi'
  },
  {
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    price: 899,
    category: 'Fantasy',
    stock: 32,
    image: 'https://m.media-amazon.com/images/I/81nV6x2ey4L._AC_UF1000,1000_QL80_.jpg',
    description: 'Middle-earth saga'
  },
  {
    title: 'Gone Girl',
    author: 'Gillian Flynn',
    price: 629,
    category: 'Thriller',
    stock: 19,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwNRvtgn9NBNLOo0moqmoTVTYW8u-fDlFSHg&s',
    description: 'Psychological thriller'
  },
  {
    title: 'The Kite Runner',
    author: 'Khaled Hosseini',
    price: 599,
    category: 'Drama',
    stock: 26,
    image: 'https://m.media-amazon.com/images/I/81QSukPYvML._UF1000,1000_QL80_.jpg',
    description: 'Friendship and redemption'
  },
  {
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    price: 749,
    category: 'History',
    stock: 38,
    image: 'https://m.media-amazon.com/images/I/713jIoMO3UL.jpg',
    description: 'History of humankind'
  },
  {
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    price: 549,
    category: 'Thriller',
    stock: 21,
    image: 'https://m.media-amazon.com/images/I/81JJPDNlxSL._AC_UF1000,1000_QL80_.jpg',
    description: 'Psychological suspense'
  },
  {
    title: 'Educated',
    author: 'Tara Westover',
    price: 649,
    category: 'Biography',
    stock: 29,
    image: 'https://www.shutterstock.com/shutterstock/photos/767491552/display_1500/stock-vector-education-tree-of-knowledge-and-open-book-effective-modern-education-template-design-back-to-767491552.jpg',
    description: 'Memoir'
  },
  {
    title: 'The Seven Husbands of Evelyn Hugo',
    author: 'Taylor Jenkins Reid',
    price: 579,
    category: 'Romance',
    stock: 34,
    image: 'https://m.media-amazon.com/images/I/81J0E3eq4PL._AC_UF1000,1000_QL80_.jpg',
    description: 'Hollywood drama'
  },

  {
    title: 'Where the Crawdads Sing',
    author: 'Delia Owens',
    price: 629,
    category: 'Mystery',
    stock: 31,
    image: 'https://m.media-amazon.com/images/I/81e+mSqZvnL.jpg',
    description: 'Coming-of-age mystery'
  },
  {
    title: 'The Midnight Library',
    author: 'Matt Haig',
    price: 549,
    category: 'Fiction',
    stock: 23,
    image: 'https://m.media-amazon.com/images/I/61ZDI0txDbL._AC_UF1000,1000_QL80_.jpg',
    description: 'Life choices'
  },
  {
    title: 'Becoming',
    author: 'Michelle Obama',
    price: 699,
    category: 'Biography',
    stock: 37,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEyl3KyfqLK3frtxVoHBLGEecFbjCduMm-mQ&s',
    description: 'First Lady memoir'
  },
  {
    title: 'The Subtle Art of Not Giving Up',
    author: 'Mark Manson',
    price: 499,
    category: 'Self-Help',
    stock: 42,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXvzdujZhP7uEr-4iLBh4b70jksfOcE23vGw&s',
    description: 'Counter-intuitive life advice'
  },
  {
    title: 'The Handmaids Tale',
    author: 'Margaret Atwood',
    price: 649,
    category: 'Science Fiction',
    stock: 28,
    image: 'https://m.media-amazon.com/images/I/91XT4tkFFeL._UF1000,1000_QL80_.jpg',
    description: 'Dystopian novel'
  },
  {
    title: 'The Power of Now',
    author: 'Eckhart Tolle',
    price: 579,
    category: 'Spirituality',
    stock: 25,
    image: 'https://m.media-amazon.com/images/I/61Ij8nLooNL._UF1000,1000_QL80_.jpg',
    description: 'Spiritual awakening'
  },
  {
    title: 'The Girl with the Dragon Tattoo',
    author: 'Stieg Larsson',
    price: 599,
    category: 'Crime',
    stock: 20,
    image: 'https://rukminim2.flixcart.com/image/480/640/kklhbbk0/book/k/r/4/the-girl-with-the-dragon-tattoo-original-imafzwrpyp5paxng.jpeg?q=90',
    description: 'Crime thriller'
  },
  {
    title: 'The Fault in Our Stars',
    author: 'John Green',
    price: 529,
    category: 'Young Adult',
    stock: 36,
    image: 'https://m.media-amazon.com/images/I/81xcbKh+JNL._UF1000,1000_QL80_.jpg',
    description: 'Teen love story'
  },
  {
    title: 'Rich Dad Poor Dad',
    author: 'Robert Kiyosaki',
    price: 449,
    category: 'Finance',
    stock: 41,
    image: 'https://m.media-amazon.com/images/I/71HJj3XmheL.jpg',
    description: 'Financial literacy'
  },
  {
    title: 'The 4-Hour Workweek',
    author: 'Timothy Ferriss',
    price: 649,
    category: 'Business',
    stock: 33,
    image: 'https://m.media-amazon.com/images/I/6142S0D-PiL.jpg',
    description: 'Escape 9-5'
  }
];

async function seedBooks() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Book.deleteMany({});
  await Book.insertMany(books);
  console.log('✅ 30 books + fixed images seeded successfully');
  process.exit(0);
}

seedBooks();
