/**
 * Test Moyassar API Connection
 * This script makes a real API call to verify your credentials work
 * 
 * Usage: node scripts/testMoyassarAPI.js
 */

require('dotenv').config();
const axios = require('axios');
const { MOYASSAR_CONFIG } = require('../config/moyassar');

console.log('\n🧪 Testing Moyassar API Connection...\n');

// Get auth header
const getAuthHeader = () => {
  if (!MOYASSAR_CONFIG.secretKey) {
    throw new Error('Secret key not configured');
  }
  const credentials = Buffer.from(`${MOYASSAR_CONFIG.secretKey}:`).toString('base64');
  return `Basic ${credentials}`;
};

async function testAPI() {
  try {
    // Test 1: List payments (GET request)
    console.log('📡 Test 1: Fetching payments list...');
    
    const response = await axios.get(
      `${MOYASSAR_CONFIG.apiUrl}/payments`,
      {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
        params: {
          limit: 1, // Just get one payment to test
        },
      }
    );

    console.log('✅ API Connection Successful!');
    console.log(`   Status: ${response.status}`);
    console.log(`   Payments found: ${response.data.payments?.length || 0}\n`);
    
    return true;
  } catch (error) {
    console.log('❌ API Connection Failed!\n');
    
    if (error.response) {
      // Server responded with error
      console.log('Error Details:');
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Status Text: ${error.response.statusText}`);
      console.log(`   Error Type: ${error.response.data?.type || 'N/A'}`);
      console.log(`   Error Message: ${error.response.data?.message || 'N/A'}`);
      
      if (error.response.status === 401) {
        console.log('\n💡 This is an authentication error.');
        console.log('   Possible causes:');
        console.log('   1. Secret key is incorrect');
        console.log('   2. Secret key has expired or been revoked');
        console.log('   3. Account has restrictions');
        console.log('   4. Using wrong environment (test vs live)');
        console.log('\n   Solutions:');
        console.log('   1. Go to Moyassar dashboard and get a fresh secret key');
        console.log('   2. Make sure you\'re using the SECRET KEY (sk_test_...) not publishable key');
        console.log('   3. Verify your account is active in Moyassar dashboard');
        console.log('   4. Check if you need to activate API access in your account settings');
      }
    } else if (error.request) {
      // Request made but no response
      console.log('   No response from server');
      console.log('   Check your internet connection and API URL');
    } else {
      // Error setting up request
      console.log('   Error:', error.message);
    }
    
    return false;
  }
}

// Run test
testAPI()
  .then(success => {
    if (success) {
      console.log('✅ All tests passed! Your Moyassar credentials are working.\n');
      process.exit(0);
    } else {
      console.log('❌ Test failed. Please fix the issues above.\n');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });

