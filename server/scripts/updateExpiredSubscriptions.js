/**
 * Script to update expired subscriptions
 * Can be run manually or via cron job
 * 
 * Usage:
 *   node scripts/updateExpiredSubscriptions.js
 */

require('dotenv').config();
const connectDB = require('../config/db');
const subscriptionService = require('../services/subscription');

const updateExpiredSubscriptions = async () => {
  try {
    console.log('🔄 Starting expired subscriptions update...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Database connected');

    // Update expired subscriptions
    const result = await subscriptionService.updateExpiredSubscriptions();

    if (result.success) {
      console.log(`✅ ${result.message}`);
      if (result.updatedCount > 0) {
        console.log(`   Updated ${result.updatedCount} subscription(s)`);
      } else {
        console.log('   No expired subscriptions found');
      }
    } else {
      console.error('❌ Error updating expired subscriptions:', result.error);
      process.exit(1);
    }

    // Close database connection
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
};

// Run the script
updateExpiredSubscriptions();

