const mongoose = require('mongoose');
require('dotenv').config();
const Order = require('./models/Order');

async function fixOrderStatus() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully');
    
    // Update all orders with 'completed' status to 'delivered'
    const result = await Order.updateMany(
      { status: 'completed' },
      { 
        status: 'delivered',
        $push: {
          statusHistory: {
            status: 'delivered',
            timestamp: new Date(),
            message: 'Order delivered (status updated)'
          }
        }
      }
    );
    
    console.log(`Updated ${result.modifiedCount} orders from 'completed' to 'delivered'`);
    
    // Check current orders
    const orders = await Order.find().sort({createdAt: -1}).limit(5);
    console.log('\nRecent orders after update:');
    orders.forEach(o => console.log(`ID: ${o._id.toString().slice(-6)}, Status: ${o.status}`));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixOrderStatus();