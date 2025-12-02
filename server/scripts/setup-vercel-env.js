/**
 * Setup script to configure environment variables for Vercel Postgres
 * 
 * This script helps set up DATABASE_URL from POSTGRES_PRISMA_URL
 * Run this after pulling Vercel environment variables
 * 
 * Usage:
 *   node scripts/setup-vercel-env.js
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const envPath = path.join(__dirname, '../.env.local');
const envExamplePath = path.join(__dirname, '../.env.example');

function setupVercelEnv() {
  // Check if POSTGRES_PRISMA_URL is available
  if (!process.env.POSTGRES_PRISMA_URL) {
    console.warn('⚠️  POSTGRES_PRISMA_URL not found in environment variables.');
    console.warn('   Make sure you have pulled Vercel environment variables:');
    console.warn('   vercel env pull .env.local');
    return;
  }

  // Read existing .env.local if it exists
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Check if DATABASE_URL is already set
  if (envContent.includes('DATABASE_URL=')) {
    // Update existing DATABASE_URL
    envContent = envContent.replace(
      /DATABASE_URL=.*/g,
      `DATABASE_URL=${process.env.POSTGRES_PRISMA_URL}`
    );
    console.log('✅ Updated DATABASE_URL in .env.local');
  } else {
    // Add DATABASE_URL
    envContent += `\n# Set DATABASE_URL to use Vercel Postgres pooled connection\n`;
    envContent += `DATABASE_URL=${process.env.POSTGRES_PRISMA_URL}\n`;
    console.log('✅ Added DATABASE_URL to .env.local');
  }

  // Write back to .env.local
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('✅ Environment configuration complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. Run migrations: npm run prisma:migrate:deploy');
  console.log('   2. Generate Prisma Client: npm run prisma:generate');
  console.log('   3. Start your server: npm run dev');
}

// Run the setup
try {
  setupVercelEnv();
} catch (error) {
  console.error('❌ Error setting up Vercel environment:', error.message);
  process.exit(1);
}

