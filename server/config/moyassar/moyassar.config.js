/**
 * Moyassar Payment Gateway Configuration
 */

const MOYASSAR_CONFIG = {
  // API Credentials
  publishableKey: process.env.MOYASSAR_PUBLISHABLE_KEY,
  secretKey: process.env.MOYASSAR_SECRET_KEY,
  webhookSecret: process.env.MOYASSAR_WEBHOOK_SECRET,
  
  // API Configuration
  apiUrl: process.env.MOYASSAR_API_URL || 'https://api.moyasar.com/v1',
  environment: process.env.MOYASSAR_ENVIRONMENT || 'sandbox',
  
  // Webhook Configuration
  webhookUrl: process.env.MOYASSAR_WEBHOOK_URL,
  
  // Payment Configuration
  currency: 'SAR', // Saudi Riyal - change if needed
  description: 'Talaam Subscription Payment',
};

// Validate required configuration
const validateConfig = () => {
  const required = ['publishableKey', 'secretKey', 'apiUrl'];
  const missing = required.filter(key => !MOYASSAR_CONFIG[key]);
  
  if (missing.length > 0) {
    console.error(`❌ Moyassar config error: Missing required configuration: ${missing.join(', ')}`);
    console.error('   Please check your .env file and ensure all Moyassar variables are set.');
    
    // Show what's configured
    console.log('\n📋 Current Configuration:');
    console.log(`   MOYASSAR_PUBLISHABLE_KEY: ${MOYASSAR_CONFIG.publishableKey ? '✅ Set' : '❌ Missing'}`);
    console.log(`   MOYASSAR_SECRET_KEY: ${MOYASSAR_CONFIG.secretKey ? '✅ Set' : '❌ Missing'}`);
    console.log(`   MOYASSAR_API_URL: ${MOYASSAR_CONFIG.apiUrl || 'Using default'}`);
    console.log(`   MOYASSAR_ENVIRONMENT: ${MOYASSAR_CONFIG.environment || 'sandbox'}`);
    console.log(`   MOYASSAR_WEBHOOK_URL: ${MOYASSAR_CONFIG.webhookUrl ? '✅ Set' : '⚠️  Not set (optional)'}\n`);
  }
  
  return missing.length === 0;
};

// Validate on module load
if (process.env.NODE_ENV !== 'test') {
  validateConfig();
}

module.exports = {
  MOYASSAR_CONFIG,
  validateConfig,
};

