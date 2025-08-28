# 🚀 Creator Search - Deployment Guide

## Prerequisites

Before deploying, ensure you have:
- ✅ Supabase project with `creators` table
- ✅ GitHub account
- ✅ Vercel account
- ✅ Domain (optional)

## Quick Deployment Steps

### 1. 📝 Configure Environment Variables

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Get your credentials:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy the **URL** and **anon/public** key

### 2. 🧪 Test Locally

```bash
# Install dependencies (if not done)
npm install

# Test build
npm run build

# Start development server
npm run dev
```

Visit http://localhost:3000 to verify everything works.

### 3. 📚 Push to GitHub

```bash
# Add remote repository (replace with your repo URL)
git remote add origin https://github.com/yourusername/creator-search.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 4. 🚀 Deploy to Vercel

#### Option A: Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. **Import** your GitHub repository
4. Configure settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

5. **Add Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key

6. Click **"Deploy"**

#### Option B: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# Redeploy with environment variables
vercel --prod
```

## 🔧 Production Configuration

### Environment Variables for Production

In Vercel dashboard, add these environment variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Production, Preview, Development |

### Domain Configuration (Optional)

1. In Vercel dashboard, go to your project
2. Navigate to **Settings** → **Domains**
3. Add your custom domain
4. Configure DNS records as instructed

## 🔍 Verify Deployment

After deployment:

1. ✅ **Application loads** without errors
2. ✅ **Search functionality** works with filters
3. ✅ **Pagination** operates correctly
4. ✅ **Database connection** is established
5. ✅ **Responsive design** works on different screen sizes

## 🛠️ Troubleshooting

### Common Issues

**Build Failures:**
- Check environment variables are set correctly
- Ensure Supabase credentials are valid
- Verify database table exists

**Runtime Errors:**
- Check browser console for JavaScript errors
- Verify Supabase URL format (should include https://)
- Confirm anon key has correct permissions

**Slow Performance:**
- Enable Vercel Analytics
- Check Supabase query performance
- Consider adding database indexes

### Debug Commands

```bash
# Test Supabase connection
npm run dev
# Check browser console at http://localhost:3000

# Verify build locally
npm run build
npm run start

# Check deployment logs
vercel logs
```

## 📊 Performance Monitoring

### Recommended Tools

1. **Vercel Analytics** - Built-in performance monitoring
2. **Supabase Dashboard** - Database performance metrics
3. **Google PageSpeed Insights** - Core Web Vitals
4. **Vercel Speed Insights** - Real user metrics

### Performance Targets

- ⚡ **First Contentful Paint**: < 1.5s
- 🔍 **Search Response Time**: < 2s
- 📱 **Largest Contentful Paint**: < 2.5s
- 🎯 **Cumulative Layout Shift**: < 0.1

## 🔄 Continuous Deployment

With GitHub integration:
- ✅ **Automatic deployments** on `main` branch pushes
- ✅ **Preview deployments** for pull requests
- ✅ **Rollback capability** to previous versions

## 🔐 Security Checklist

- ✅ Environment variables are secure
- ✅ Supabase RLS policies are configured
- ✅ HTTPS is enabled (automatic with Vercel)
- ✅ API keys are not exposed in client code
- ✅ Database access is restricted to necessary operations

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Review [Next.js deployment docs](https://nextjs.org/docs/deployment)
3. Check [Vercel documentation](https://vercel.com/docs)
4. Review [Supabase guides](https://supabase.com/docs)

---

**🎉 Your Creator Search application is now live and ready for use!**
