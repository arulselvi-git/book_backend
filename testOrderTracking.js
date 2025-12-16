const mongoose = require('mongoose');
require('dotenv').config();
const Order = require('./models/Order');

async function testOrderTracking() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully');
    
    // Create a test order with past date to simulate timing
    const testOrder = new Order({
      userId: '693d04ba0a8a9a9b3004afba', // Use existing user ID
      bookId: '693ece849f1154e7d6b4baa2', // Use existing book ID
      quantity: 1,
      totalAmount: 499,
      shippingAddress: {
        name: 'Test User',
        phone: '1234567890',
        address: 'Test Address',
        city: 'Test City',
        pincode: '123456'
      },
      status: 'ordered',
      orderDate: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      statusHistory: [{
        status: 'ordered',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        message: 'Test order placed'
      }]
    });
    
    await testOrder.save();
    console.log('Test order created:', testOrder._id);
    
    // Run the tracking update
    const now = new Date();
    
    // Check for orders to pack (after 2 hours)
    const ordersToPackAfter2Hours = await Order.find({
      status: 'ordered',
      orderDate: { $lte: new Date(now.getTime() - 2 * 60 * 60 * 1000) }
    });
    
    console.log(`Found ${ordersToPackAfter2Hours.length} orders to pack`);
    
    for (const order of ordersToPackAfter2Hours) {
      await Order.findByIdAndUpdate(order._id, {
        status: 'packed',
        $push: {
          statusHistory: {
            status: 'packed',
            timestamp: new Date(),
            message: 'Order has been packed and ready for shipping'
          }
        }
      });
      console.log(`Order ${order._id} updated to packed`);
    }
    
    console.log('✅ Order tracking test completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testOrderTracking();