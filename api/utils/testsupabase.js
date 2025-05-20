const supabase = require('./supabaseClient');

async function testSupabase() {
  try {
    const { data, error } = await supabase.from('users').select('*').limit(1);
    if (error) {
      console.error('Supabase query error:', error);
    } else {
      console.log('User sample data:', data);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testSupabase();