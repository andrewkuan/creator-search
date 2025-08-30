// Debug script to test query record logging
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testQueryLogging() {
  console.log('🔍 Testing Query Record Logging...\n');
  
  // Initialize Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log('Environment Variables:');
  console.log('- SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('- SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing');
  console.log('');
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  // Test 1: Check if query_record table exists and is accessible
  console.log('Test 1: Checking query_record table access...');
  try {
    const { data, error, count } = await supabase
      .from('query_record')
      .select('*', { count: 'exact' })
      .limit(5);
    
    if (error) {
      console.error('❌ Error accessing query_record table:', error.message);
      console.error('Full error:', error);
    } else {
      console.log('✅ query_record table accessible');
      console.log('📊 Current record count:', count);
      console.log('📄 Sample records:', data);
    }
  } catch (err) {
    console.error('❌ Exception accessing query_record:', err);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 2: Try to insert a test record
  console.log('Test 2: Attempting to insert test record...');
  const testRecord = {
    user_query: 'DEBUG TEST: Turkish gaming creators',
    chatgpt_query: JSON.stringify({
      locations: ['TR'],
      verticals: ['GAMER', 'Gaming']
    }, null, 2),
    supabase_query: "SELECT * FROM creator_list WHERE Location IN ('TR') AND Vertical IN ('GAMER', 'Gaming')"
  };
  
  try {
    const { data, error } = await supabase
      .from('query_record')
      .insert([testRecord])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error inserting test record:', error.message);
      console.error('Full error:', error);
      
      // Check if it's an RLS issue
      if (error.message.includes('policy') || error.message.includes('RLS') || error.code === 'PGRST116') {
        console.log('\n🛡️  This looks like a Row Level Security (RLS) issue!');
        console.log('Possible solutions:');
        console.log('1. Disable RLS on query_record table');
        console.log('2. Create a policy allowing INSERT for anonymous users');
        console.log('3. Use service role key instead of anon key');
      }
    } else {
      console.log('✅ Test record inserted successfully!');
      console.log('📄 Inserted record:', data);
    }
  } catch (err) {
    console.error('❌ Exception inserting test record:', err);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 3: Check table structure
  console.log('Test 3: Checking table structure...');
  try {
    const { data, error } = await supabase
      .from('query_record')
      .select('*')
      .limit(1);
    
    if (data && data.length > 0) {
      console.log('✅ Table columns:', Object.keys(data[0]));
    } else if (!error) {
      console.log('ℹ️  Table exists but is empty');
    }
  } catch (err) {
    console.error('❌ Exception checking table structure:', err);
  }
  
  console.log('\n🏁 Debug test completed!');
}

testQueryLogging().catch(console.error);
