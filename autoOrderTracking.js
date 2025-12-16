const mongoose = require('mongoose');
require('dotenv').config();
const Order = require('./models/Order');

async function updateOrderStatus() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for order tracking...');
    
    const now = new Date();
    
    // Update orders to 'packed' after 2 hours
    const ordersToPackAfter2Hours = await Order.find({
      status: 'ordered',
      orderDate: { $lte: new Date(now.getTime() - 2 * 60 * 60 * 1000) }
    });
    
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
    
    // Update orders to 'shipped' after 1 day (24 hours) from order date
    const ordersToShipAfter1Day = await Order.find({
      status: 'packed',
      orderDate: { $lte: new Date(now.getTime() - 24 * 60 * 60 * 1000) }
    });
    
    for (const order of ordersToShipAfter1Day) {
      await Order.findByIdAndUpdate(order._id, {
        status: 'shipped',
        $push: {
          statusHistory: {
            status: 'shipped',
            timestamp: new Date(),
            message: 'Order has been shipped and is on the way'
          }
        }
      });
      console.log(`Order ${order._id} updated to shipped`);
    }
    
    // Update orders to 'delivered' after 2 days (48 hours) from order date
    const ordersToDeliverAfter2Days = await Order.find({
      status: 'shipped',
      orderDate: { $lte: new Date(now.getTime() - 48 * 60 * 60 * 1000) }
    });
    
    for (const order of ordersToDeliverAfter2Days) {
      await Order.findByIdAndUpdate(order._id, {
        status: 'delivered',
        $push: {
          statusHistory: {
            status: 'delivered',
            timestamp: new Date(),
            message: 'Order has been successfully delivered'
          }
        }
      });
      console.log(`Order ${order._id} updated to delivered`);
    }
    
    console.log('Order tracking update completed');
  } catch (error) {
    console.error('Error updating order status:', error);
  }
}

// Run immediately and then every 30 minutes
updateOrderStatus();
setInterval(updateOrderStatus, 30 * 60 * 1000);

module.exports = updateOrderStatus;