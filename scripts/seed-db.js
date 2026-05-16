const { Client } = require('pg');

const config = {
  user: 'postgres.croclzeypelnpilxbzro',
  host: 'aws-0-eu-west-1.pooler.supabase.com',
  database: 'postgres',
  password: '_EMC?t!qG_5mi#M',
  port: 6543,
  ssl: {
    rejectUnauthorized: false
  }
};

const mockWahalas = [
  {
    title: 'NEPA took light since morning',
    description: 'I was just about to save my work and the transformer blew up. Now the whole street is in darkness.',
    severity: 4,
    mood: 'angry',
    category: 'General'
  },
  {
    title: 'Fuel price increased again',
    description: 'Queuing at the station for 3 hours only for them to increase the price right when it was my turn.',
    severity: 5,
    mood: 'stressed',
    category: 'Finance'
  },
  {
    title: 'Client asked for "small logo change"',
    description: 'The "small change" turned into a complete redesign of the whole website. Omo!',
    severity: 3,
    mood: 'neutral',
    category: 'Work'
  },
  {
    title: 'Suya man no give me enough onion',
    description: 'I bought 2k suya and this man gave me 2 slices of onion. Is this a joke?',
    severity: 1,
    mood: 'happy',
    category: 'General'
  },
  {
    title: 'Danfo driver almost hit my car',
    description: 'The guy just swerved into my lane without signal. Third Mainland Bridge is a war zone.',
    severity: 4,
    mood: 'stressed',
    category: 'Transport'
  }
];

async function seed() {
  const client = new Client(config);

  try {
    await client.connect();
    console.log('Connected to database!');

    for (const wahala of mockWahalas) {
      await client.query(
        'INSERT INTO public.wahalas (title, description, severity, mood, category) VALUES ($1, $2, $3, $4, $5)',
        [wahala.title, wahala.description, wahala.severity, wahala.mood, wahala.category]
      );
      console.log(`Inserted: ${wahala.title}`);
    }

    console.log('Seeding complete! 🇳🇬');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await client.end();
  }
}

seed();
