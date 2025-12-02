/**
 * Check environment variables for database connection
 * Usage: node scripts/check-env.js
 */

require('dotenv').config({ path: '.env.local' });

console.log('🔍 Checking Environment Variables...\n');

const envVars = {
  'POSTGRES_PRISMA_DATABASE_URL': process.env.POSTGRES_PRISMA_DATABASE_URL,
  'POSTGRES_PRISMA_URL': process.env.POSTGRES_PRISMA_URL,
  'POSTGRES_URL': process.env.POSTGRES_URL,
  'POSTGRES_URL_NON_POOLING': process.env.POSTGRES_URL_NON_POOLING,
  'DATABASE_URL': process.env.DATABASE_URL,
  'VERCEL': process.env.VERCEL,
  'NODE_ENV': process.env.NODE_ENV,
};

console.log('Database Connection Variables:');
console.log('─'.repeat(50));

for (const [key, value] of Object.entries(envVars)) {
  if (key.includes('URL') && value) {
    // Mask sensitive parts of connection string
    const masked = value.replace(/:[^:@]+@/, ':****@').substring(0, 60) + '...';
    console.log(`✅ ${key}: ${masked}`);
  } else if (value) {
    console.log(`✅ ${key}: ${value}`);
  } else {
    console.log(`❌ ${key}: Missing`);
  }
}

console.log('\n' + '─'.repeat(50));

// Check which connection string will be used
const connectionString = 
  process.env.POSTGRES_PRISMA_DATABASE_URL || 
  process.env.POSTGRES_PRISMA_URL || 
  process.env.DATABASE_URL;

if (connectionString) {
  const usingVar = process.env.POSTGRES_PRISMA_DATABASE_URL 
    ? 'POSTGRES_PRISMA_DATABASE_URL' 
    : process.env.POSTGRES_PRISMA_URL 
      ? 'POSTGRES_PRISMA_URL' 
      : 'DATABASE_URL';
  console.log('\n✅ Connection string found!');
  console.log(`   Using: ${usingVar}`);
  
  // Test if it's a valid PostgreSQL URL
  if (connectionString.startsWith('postgresql://') || connectionString.startsWith('postgres://')) {
    console.log('✅ Valid PostgreSQL connection string format');
  } else {
    console.log('⚠️  Warning: Connection string format may be invalid');
  }
} else {
  console.log('\n❌ No connection string found!');
  console.log('   Please set POSTGRES_PRISMA_DATABASE_URL (Vercel) or DATABASE_URL');
}

console.log('\n' + '─'.repeat(50));

