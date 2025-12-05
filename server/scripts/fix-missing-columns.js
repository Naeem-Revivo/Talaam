require('dotenv').config();
const { Pool } = require('pg');

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

async function checkAndFixColumns() {
  const client = await pool.connect();
  try {
    console.log('🔍 Checking columns in questions table...\n');
    
    // Check existing columns
    const existingColumns = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'questions'
      ORDER BY column_name
    `);
    
    const columnNames = existingColumns.rows.map(r => r.column_name);
    console.log('Existing columns:', columnNames.join(', '));
    console.log('');
    
    // Expected columns from flagging migration
    const expectedFlaggingColumns = [
      'is_flagged',
      'flagged_by_id',
      'flag_reason',
      'flag_type',
      'flag_status',
      'flag_reviewed_by_id',
      'flag_rejection_reason'
    ];
    
    // Expected columns from assigned processor migration
    const expectedProcessorColumns = [
      'assigned_processor_id'
    ];
    
    const allExpected = [...expectedFlaggingColumns, ...expectedProcessorColumns];
    const missing = allExpected.filter(col => !columnNames.includes(col));
    
    if (missing.length === 0) {
      console.log('✅ All expected columns exist!');
      return;
    }
    
    console.log('❌ Missing columns:', missing.join(', '));
    console.log('\n🔧 Adding missing columns...\n');
    
    await client.query('BEGIN');
    
    // Add flagging columns
    for (const col of expectedFlaggingColumns) {
      if (missing.includes(col)) {
        try {
          if (col === 'is_flagged') {
            await client.query(`
              ALTER TABLE "questions" ADD COLUMN "is_flagged" BOOLEAN NOT NULL DEFAULT false
            `);
            console.log(`✅ Added column: ${col}`);
          } else {
            await client.query(`
              ALTER TABLE "questions" ADD COLUMN "${col}" TEXT
            `);
            console.log(`✅ Added column: ${col}`);
          }
        } catch (error) {
          if (error.message.includes('already exists')) {
            console.log(`⚠️  Column ${col} already exists (skipping)`);
          } else {
            throw error;
          }
        }
      }
    }
    
    // Add assigned_processor_id column
    if (missing.includes('assigned_processor_id')) {
      try {
        await client.query(`
          ALTER TABLE "questions" ADD COLUMN "assigned_processor_id" TEXT
        `);
        console.log(`✅ Added column: assigned_processor_id`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`⚠️  Column assigned_processor_id already exists (skipping)`);
        } else {
          throw error;
        }
      }
    }
    
    // Add index for flagging
    const indexCheck = await client.query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename = 'questions' AND indexname = 'questions_is_flagged_flag_status_idx'
    `);
    
    if (indexCheck.rows.length === 0) {
      try {
        await client.query(`
          CREATE INDEX "questions_is_flagged_flag_status_idx" ON "questions"("is_flagged", "flag_status")
        `);
        console.log('✅ Added index: questions_is_flagged_flag_status_idx');
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log('⚠️  Index already exists (skipping)');
        } else {
          throw error;
        }
      }
    }
    
    // Add foreign keys
    const fkConstraints = [
      {
        name: 'questions_flagged_by_id_fkey',
        sql: 'ALTER TABLE "questions" ADD CONSTRAINT "questions_flagged_by_id_fkey" FOREIGN KEY ("flagged_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE'
      },
      {
        name: 'questions_flag_reviewed_by_id_fkey',
        sql: 'ALTER TABLE "questions" ADD CONSTRAINT "questions_flag_reviewed_by_id_fkey" FOREIGN KEY ("flag_reviewed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE'
      },
      {
        name: 'questions_assigned_processor_id_fkey',
        sql: 'ALTER TABLE "questions" ADD CONSTRAINT "questions_assigned_processor_id_fkey" FOREIGN KEY ("assigned_processor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE'
      }
    ];
    
    for (const fk of fkConstraints) {
      const fkCheck = await client.query(`
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE constraint_name = $1 AND table_name = 'questions'
      `, [fk.name]);
      
      if (fkCheck.rows.length === 0) {
        try {
          await client.query(fk.sql);
          console.log(`✅ Added foreign key: ${fk.name}`);
        } catch (error) {
          if (error.message.includes('already exists')) {
            console.log(`⚠️  Foreign key ${fk.name} already exists (skipping)`);
          } else {
            throw error;
          }
        }
      }
    }
    
    await client.query('COMMIT');
    console.log('\n✅ All missing columns and constraints have been added!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

checkAndFixColumns()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });

