const mongoose = require('mongoose');
require('dotenv').config();
const Order = require('./models/Order');

async function updateExistingOrders() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully');
    
    // Update all existing orders with new status names
    const orders = await Order.find({});
    console.log(`Found ${orders.length} orders to update`);
    
    for (const order of orders) {
      let newStatus = order.status;
      
      // Map old status to new status
      if (order.status === 'pending') newStatus = 'ordered';
      if (order.status === 'confirmed') newStatus = 'packed';
      
      // Initialize statusHistory if it doesn't exist
      const statusHistory = order.statusHistory || [{
        status: newStatus,
        timestamp: order.orderDate,
        message: `Order ${newStatus}`
      }];
      
      await Order.findByIdAndUpdate(order._id, {
        status: newStatus,
        statusHistory: statusHistory
      });
      
      console.log(`Updated order ${order._id}: ${order.status} → ${newStatus}`);
    }
    
    console.log('✅ All orders updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating orders:', error);
    process.exit(1);
  }
}

updateExistingOrders();