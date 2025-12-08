// reset-bookings.js
// Chạy file này để xóa collection bookings và tạo lại

const mongoose = require('mongoose');
require('dotenv').config();

async function resetBookings() {
  try {
    // Kết nối database
    await mongoose.connect(process.env.DATABASE);
    console.log('Connected to database');
    
    // Xóa collection bookings
    await mongoose.connection.db.dropCollection('bookings');
    console.log('✅ Dropped bookings collection');
    
    // Tạo lại collection với schema mới
    const Booking = require('./models/booking.model');
    await Booking.createCollection();
    console.log('✅ Created new bookings collection');
    
    console.log('\n🎉 Done! Restart your server and try booking again.');
    
    process.exit(0);
  } catch (error) {
    if (error.message.includes('ns not found')) {
      console.log('⚠️  Collection bookings does not exist, creating new one...');
      const Booking = require('./models/booking.model');
      await Booking.createCollection();
      console.log('✅ Created new bookings collection');
      process.exit(0);
    } else {
      console.error('Error:', error);
      process.exit(1);
    }
  }
}

resetBookings();