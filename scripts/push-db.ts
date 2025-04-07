// Database migration script
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as schema from '../shared/schema';

const main = async () => {
  console.log('Starting database migration...');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  // Create drizzle instance
  const db = drizzle(pool, { schema });

  // Push schema to database
  console.log('Pushing schema changes to database...');
  await migrate(db, { migrationsFolder: './migrations' });
  
  console.log('Migration completed successfully!');
  process.exit(0);
};

main().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});