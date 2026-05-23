const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testSupabase() {
  console.log('Testing Supabase wahalas table...');
  const { data, error } = await supabase.from('wahalas').select('*').limit(1);
  if (error) {
    console.error('Supabase Error:', error);
  } else {
    console.log('Data:', data);
    if (data.length > 0) {
      console.log('Columns found:', Object.keys(data[0]));
    } else {
      console.log('Table is empty. Attempting a test insert...');
      const { error: insertError } = await supabase.from('wahalas').insert([
        { title: 'Test', mood: 'neutral', category: 'Test', user_id: 'test-uid' }
      ]);
      if (insertError) {
        console.error('Insert Error:', insertError);
      } else {
        console.log('Insert succeeded! Table has user_id column.');
      }
    }
  }
}

testSupabase();
