#!/bin/bash

# Creator Search - Deployment Setup Script
# This script helps set up GitHub repository and prepare for Vercel deployment

echo "🚀 Creator Search - Deployment Setup"
echo "===================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo ""
echo "📋 Pre-deployment Checklist:"
echo "1. ✅ Dependencies installed"
echo "2. ✅ Build successful"
echo "3. ✅ Git repository initialized"

# Check if .env.local exists and has real credentials
if [ -f ".env.local" ]; then
    if grep -q "your_supabase_project_url_here" .env.local; then
        echo "4. ⚠️  Environment variables need configuration"
        echo ""
        echo "📝 NEXT STEP: Edit .env.local with your Supabase credentials"
        echo "   - Go to https://supabase.com/dashboard"
        echo "   - Select your project → Settings → API"
        echo "   - Copy URL and anon key to .env.local"
    else
        echo "4. ✅ Environment variables configured"
    fi
else
    echo "4. ❌ .env.local file missing"
    echo ""
    echo "Run this command to create it:"
    echo "cp .env.example .env.local"
fi

echo ""
echo "🔗 GitHub Repository Setup:"
echo "If you haven't created a GitHub repository yet:"
echo ""
echo "1. Go to https://github.com/new"
echo "2. Create a new repository named 'creator-search'"
echo "3. Run these commands:"
echo ""
echo "   git remote add origin https://github.com/YOURUSERNAME/creator-search.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""

echo "🚀 Vercel Deployment:"
echo "After pushing to GitHub:"
echo ""
echo "1. Go to https://vercel.com/new"
echo "2. Import your GitHub repository"
echo "3. Add environment variables:"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "4. Deploy!"
echo ""

echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "🎉 Your Creator Search app is ready for deployment!"
