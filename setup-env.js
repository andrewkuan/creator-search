#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envTemplate = `# Supabase Configuration
# Replace with your actual Supabase project credentials

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Example format:
# NEXT_PUBLIC_SUPABASE_URL=https://yourprojectid.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
`;

const envPath = path.join(__dirname, '.env.local');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ Created .env.local file');
  console.log('📝 Please edit .env.local with your Supabase credentials');
} else {
  console.log('⚠️  .env.local already exists');
}

console.log('\n🔗 To get your Supabase credentials:');
console.log('1. Go to https://supabase.com/dashboard');
console.log('2. Select your project');
console.log('3. Go to Settings > API');
console.log('4. Copy the URL and anon/public key');
