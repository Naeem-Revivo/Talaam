require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Get connection string from environment
const connectionString = 
  process.env.POSTGRES_PRISMA_DATABASE_URL || 
  process.env.POSTGRES_PRISMA_URL || 
  process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ Database connection string is missing!');
  process.exit(1);
}

const pool = new Pool({
  connectionString: connectionString,
});

async function applyMigration() {
  const client = await pool.connect();
  try {
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, 'prisma', 'migrations', '20241220000016_add_assigned_processor_to_question', 'migration.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Applying migration...');
    await client.query('BEGIN');
    
    // Check if column already exists
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'questions' AND column_name = 'assigned_processor_id'
    `);
    
    if (checkColumn.rows.length > 0) {
      console.log('✅ Column assigned_processor_id already exists');
    } else {
      // Execute the migration
      await client.query(migrationSQL);
      console.log('✅ Migration applied successfully');
    }
    
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.message.includes('already exists')) {
      console.log('✅ Column or constraint already exists - migration already applied');
    } else {
      console.error('❌ Error applying migration:', error.message);
      throw error;
    }
  } finally {
    client.release();
    await pool.end();
  }
}

applyMigration()
  .then(() => {
    console.log('Migration process completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });

