const subscriptionService = require('../../services/subscription');
const connectDB = require('../../config/db');

/**
 * Vercel Cron Job endpoint for updating expired subscriptions
 * Configure this in vercel.json under "crons"
 */
module.exports = async (req, res) => {
  // Verify it's a cron request (Vercel adds this header)
  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Ensure database is connected
    await connectDB();

    console.log('🔄 [CRON] Running expired subscriptions update job...');
    
    const result = await subscriptionService.updateExpiredSubscriptions();
    
    if (result.success) {
      console.log(`✅ [CRON] ${result.message}`);
      return res.status(200).json({
        success: true,
        message: result.message,
        updatedCount: result.updatedCount
      });
    } else {
      console.error('❌ [CRON] Error updating expired subscriptions:', result.error);
      return res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('❌ [CRON] Fatal error in subscription expiry job:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

