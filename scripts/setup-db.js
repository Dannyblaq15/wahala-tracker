const { Client } = require('pg');

const connectionString = 'postgresql://postgres.croclzeypelnpilxbzro:[_EMC?t!qG_5mi#M]@db.croclzeypelnpilxbzro.supabase.com:5432/postgres';

async function setup() {
  const client = new Client({
    user: 'postgres.croclzeypelnpilxbzro',
    host: 'db.croclzeypelnpilxbzro.supabase.com',
    database: 'postgres',
    password: '[_EMC?t!qG_5mi#M]',
    port: 5432,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Connected to database!');

    // Create table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.wahalas (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT DEFAULT '',
        severity INTEGER CHECK (severity >= 1 AND severity <= 5),
        mood TEXT NOT NULL,
        category TEXT DEFAULT 'General',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
    `);
    console.log('Table "wahalas" created successfully!');

    // Enable realtime (if not already enabled)
    // Note: This requires specific permissions, but let's try
    try {
      await client.query('ALTER PUBLICATION supabase_realtime ADD TABLE public.wahalas;');
      console.log('Realtime enabled for "wahalas"!');
    } catch (e) {
      console.log('Realtime might already be enabled or permission denied (usually fine if already enabled).');
    }

    console.log('Setup complete! 🇳🇬');
  } catch (err) {
    console.error('Error setting up database:', err);
  } finally {
    await client.end();
  }
}

setup();
