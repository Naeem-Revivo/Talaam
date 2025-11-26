const cron = require('node-cron');
const subscriptionService = require('../../services/subscription');

/**
 * Start the subscription expiry job
 * Runs daily at midnight (00:00)
 */
const startSubscriptionExpiryJob = () => {
  // Schedule: Run daily at midnight (00:00)
  // Format: minute hour day month dayOfWeek
  // '0 0 * * *' = every day at 00:00
  cron.schedule('0 0 * * *', async () => {
    console.log('🔄 [CRON] Running expired subscriptions update job...');
    
    try {
      const result = await subscriptionService.updateExpiredSubscriptions();
      
      if (result.success) {
        console.log(`✅ [CRON] ${result.message}`);
        if (result.updatedCount > 0) {
          console.log(`   Updated ${result.updatedCount} expired subscription(s)`);
        }
      } else {
        console.error('❌ [CRON] Error updating expired subscriptions:', result.error);
      }
    } catch (error) {
      console.error('❌ [CRON] Fatal error in subscription expiry job:', error);
    }
  });

  console.log('✅ Subscription expiry job scheduled (runs daily at 00:00)');
};

/**
 * Alternative: Run every hour
 * Uncomment and use this if you want more frequent checks
 */
const startSubscriptionExpiryJobHourly = () => {
  // Runs every hour at minute 0
  cron.schedule('0 * * * *', async () => {
    console.log('🔄 [CRON] Running expired subscriptions update job (hourly)...');
    
    try {
      const result = await subscriptionService.updateExpiredSubscriptions();
      
      if (result.success && result.updatedCount > 0) {
        console.log(`✅ [CRON] ${result.message}`);
      }
    } catch (error) {
      console.error('❌ [CRON] Error in subscription expiry job:', error);
    }
  });

  console.log('✅ Subscription expiry job scheduled (runs every hour)');
};

module.exports = {
  startSubscriptionExpiryJob,
  startSubscriptionExpiryJobHourly,
};

