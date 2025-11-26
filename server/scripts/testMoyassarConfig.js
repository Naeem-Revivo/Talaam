/**
 * Test Moyassar Configuration
 * Run this script to verify your Moyassar credentials are set correctly
 * 
 * Usage: node scripts/testMoyassarConfig.js
 */

require('dotenv').config();
const { MOYASSAR_CONFIG } = require('../config/moyassar');

console.log('\n🔍 Testing Moyassar Configuration...\n');

// Check each configuration
const checks = [
  {
    name: 'MOYASSAR_PUBLISHABLE_KEY',
    value: MOYASSAR_CONFIG.publishableKey,
    required: true,
  },
  {
    name: 'MOYASSAR_SECRET_KEY',
    value: MOYASSAR_CONFIG.secretKey,
    required: true,
  },
  {
    name: 'MOYASSAR_WEBHOOK_SECRET',
    value: MOYASSAR_CONFIG.webhookSecret,
    required: false,
  },
  {
    name: 'MOYASSAR_API_URL',
    value: MOYASSAR_CONFIG.apiUrl,
    required: true,
  },
  {
    name: 'MOYASSAR_ENVIRONMENT',
    value: MOYASSAR_CONFIG.environment,
    required: false,
  },
  {
    name: 'MOYASSAR_WEBHOOK_URL',
    value: MOYASSAR_CONFIG.webhookUrl,
    required: false,
  },
];

let allValid = true;

checks.forEach(check => {
  const status = check.value ? '✅' : '❌';
  const required = check.required ? '(REQUIRED)' : '(OPTIONAL)';
  
  if (check.value) {
    // Mask sensitive values
    let displayValue = check.value;
    if (check.name.includes('SECRET') || check.name.includes('KEY')) {
      displayValue = check.value.substring(0, 10) + '...' + check.value.substring(check.value.length - 4);
    }
    console.log(`${status} ${check.name} ${required}: ${displayValue}`);
  } else {
    console.log(`${status} ${check.name} ${required}: NOT SET`);
    if (check.required) {
      allValid = false;
    }
  }
});

console.log('\n');

if (!allValid) {
  console.log('❌ Configuration is incomplete!');
  console.log('Please check your .env file and ensure all required values are set.\n');
  process.exit(1);
}

// Test authentication header generation
console.log('🔐 Testing Authentication Header...\n');

try {
  const credentials = Buffer.from(`${MOYASSAR_CONFIG.secretKey}:`).toString('base64');
  const authHeader = `Basic ${credentials}`;
  
  console.log('✅ Auth header generated successfully');
  console.log(`   Format: Basic <base64_encoded>`);
  console.log(`   Length: ${authHeader.length} characters`);
  console.log(`   Preview: ${authHeader.substring(0, 20)}...\n`);
} catch (error) {
  console.log('❌ Failed to generate auth header:', error.message);
  process.exit(1);
}

// Test API URL format
console.log('🌐 Testing API URL...\n');

if (MOYASSAR_CONFIG.apiUrl && MOYASSAR_CONFIG.apiUrl.startsWith('https://')) {
  console.log(`✅ API URL format is correct: ${MOYASSAR_CONFIG.apiUrl}\n`);
} else {
  console.log(`⚠️  API URL might be incorrect: ${MOYASSAR_CONFIG.apiUrl}`);
  console.log('   Expected format: https://api.moyasar.com/v1\n');
}

// Check secret key format
console.log('🔑 Checking Secret Key Format...\n');

if (MOYASSAR_CONFIG.secretKey) {
  if (MOYASSAR_CONFIG.secretKey.startsWith('sk_test_')) {
    console.log('✅ Secret key appears to be a TEST key (sandbox)');
  } else if (MOYASSAR_CONFIG.secretKey.startsWith('sk_live_')) {
    console.log('✅ Secret key appears to be a LIVE key (production)');
  } else {
    console.log('⚠️  Secret key format is unexpected');
    console.log('   Expected: sk_test_... or sk_live_...');
  }
  console.log(`   Key length: ${MOYASSAR_CONFIG.secretKey.length} characters\n`);
}

console.log('✅ Configuration check complete!\n');

