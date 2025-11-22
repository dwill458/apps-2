# Supabase Setup Guide - Cozy Growth

This guide will walk you through setting up Supabase as the backend for your Cozy Growth app.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Node.js 18+ installed
- Git installed

---

## Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in project details:
   - **Name**: `cozy-growth-production` (or your preferred name)
   - **Database Password**: Generate a strong password (save it securely!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Start with Free tier
4. Click **"Create new project"**
5. Wait 1-2 minutes for provisioning

---

## Step 2: Run Database Migrations

### Option A: Using Supabase SQL Editor (Recommended)

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy and paste the contents of each migration file in order:

#### Migration 1: Initial Schema
```bash
# Copy contents from:
backend/supabase/migrations/001_initial_schema.sql
```
- Paste into SQL Editor
- Click **"Run"**
- Verify: "Success. No rows returned"

#### Migration 2: RLS Policies
```bash
# Copy contents from:
backend/supabase/migrations/002_rls_policies.sql
```
- Paste into SQL Editor
- Click **"Run"**
- Verify: "Success. No rows returned"

#### Migration 3: Functions
```bash
# Copy contents from:
backend/supabase/migrations/003_functions.sql
```
- Paste into SQL Editor
- Click **"Run"**
- Verify: Check "Functions" tab to see new functions

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

---

## Step 3: Optional - Load Seed Data (Development Only)

For testing, you can load sample data:

1. Go to **SQL Editor** in Supabase dashboard
2. Copy contents from `backend/supabase/seed.sql`
3. Paste and click **"Run"**

This creates 3 test users with goals, tasks, and activity.

**Note**: Don't run seed data in production!

---

## Step 4: Enable Authentication Providers

### Email Magic Link (Built-in)

1. Go to **Authentication** → **Providers**
2. **Email** should be enabled by default
3. Under **Email Auth** settings:
   - ✅ Enable email confirmations (optional - disable for faster development)
   - ✅ Enable email change confirmations
   - Configure email templates (optional)

### Google OAuth (Optional)

1. Create a Google OAuth app:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Go to **APIs & Services** → **Credentials**
   - Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
   - Application type: **Web application**
   - Authorized redirect URIs: Add your Supabase callback URL
     ```
     https://[your-project-ref].supabase.co/auth/v1/callback
     ```
   - Copy **Client ID** and **Client Secret**

2. Configure in Supabase:
   - Go to **Authentication** → **Providers**
   - Find **Google** and click **Enable**
   - Paste **Client ID** and **Client Secret**
   - Click **Save**

---

## Step 5: Get API Credentials

1. Go to **Settings** → **API**
2. Copy the following values:

```env
Project URL: https://[your-project-ref].supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 6: Configure Frontend Environment

1. In the `frontend/` directory, copy the example environment file:

```bash
cd frontend
cp .env.example .env
```

2. Edit `.env` and add your Supabase credentials:

```env
VITE_APP_NAME="Cozy Growth"
VITE_SUPABASE_URL=https://[your-project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **Important**: Never commit `.env` to git (it's in `.gitignore`)

---

## Step 7: Test the Connection

1. Start your development server:

```bash
npm run dev
```

2. Open browser to [http://localhost:5173](http://localhost:5173)

3. Try signing in:
   - Click **"Sign in with Magic Link"**
   - Enter your email
   - Check your email for the magic link
   - Click the link to authenticate

4. Verify in Supabase dashboard:
   - Go to **Authentication** → **Users**
   - You should see your new user

5. Check database:
   - Go to **Table Editor** → **users** table
   - You should see a profile record created

---

## Troubleshooting

### "Invalid project URL" error

- ✅ Check that `VITE_SUPABASE_URL` starts with `https://`
- ✅ Verify project ref is correct
- ✅ Restart dev server after changing `.env`

### "Invalid API key" error

- ✅ Use the **anon/public** key, not the **service_role** key
- ✅ Key should start with `eyJhbGciOiJIUzI1NiIs...`
- ✅ No extra spaces or quotes in `.env`

### Authentication not working

- ✅ Check email provider is enabled (Authentication → Providers)
- ✅ For magic links, check your spam folder
- ✅ Verify redirect URL is whitelisted (Authentication → URL Configuration)

### Database errors

- ✅ Verify all migrations ran successfully
- ✅ Check RLS policies are enabled: `Authentication → Policies`
- ✅ Test queries in SQL Editor first

### Real-time not updating

- ✅ Check if realtime is enabled: Project Settings → API → Realtime
- ✅ Verify table has realtime enabled: Table Editor → Select table → Settings → Enable Realtime

---

## Security Best Practices

### Row Level Security (RLS)

All tables have RLS enabled. Users can only access their own data:

```sql
-- Example policy on goals table
create policy "Users can read own goals"
  on goals for select
  using (auth.uid() = user_id);
```

### API Keys

- **anon key**: Safe to use in frontend (has RLS protection)
- **service_role key**: Never expose in frontend! (bypasses RLS)

### Environment Variables

- Never commit `.env` to version control
- Use different projects for development and production
- Rotate keys if accidentally exposed

---

## Database Schema Overview

### Core Tables

1. **users**: User profiles and gamification stats
2. **goals**: User goals with plant metaphor
3. **micro_tasks**: Bite-sized tasks (3-15 minutes)
4. **completions**: Task completion records
5. **journal_entries**: Reflective journal (seed/sprout/bloom)
6. **streak_logs**: Daily activity tracking
7. **badges**: Achievement badges
8. **learning_patterns**: AI-detected patterns
9. **grace_bloom_uses**: Streak protection usage

### Key Features

- **UUIDs** for all IDs (better for distributed systems)
- **TIMESTAMPTZ** for all dates (timezone-aware)
- **JSONB** for flexible settings storage
- **ENUM types** for type safety
- **Foreign key constraints** with CASCADE deletes
- **Indexes** on frequently queried columns
- **RLS policies** for security

---

## Monitoring & Maintenance

### View Database Stats

1. Go to **Database** → **Roles**
2. Check connection count, table sizes

### View Logs

1. Go to **Logs** in sidebar
2. Filter by:
   - API requests
   - Database queries
   - Auth events

### Backups

Supabase automatically backs up your database daily (Pro plan and above).

For manual backups:
1. Go to **Database** → **Backups**
2. Click **"Backup now"** (Pro plan only)

---

## Scaling Considerations

### Free Tier Limits

- 500 MB database size
- 2 GB bandwidth/month
- 50,000 monthly active users
- Paused after 1 week of inactivity

### When to Upgrade

- Approaching database size limit
- Need more than 2 GB bandwidth
- Want automated backups
- Need point-in-time recovery
- Remove "paused project" limitation

---

## Next Steps

✅ Database is set up
✅ Authentication is configured
✅ Frontend is connected

Now you can:
1. **Customize**: Modify tables/functions as needed
2. **Deploy**: Deploy frontend to Vercel/Netlify
3. **Add Features**: Implement AI integration (Phase 3)
4. **Monitor**: Track usage in Supabase dashboard

---

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime Documentation](https://supabase.com/docs/guides/realtime)

---

## Support

If you encounter issues:

1. Check [Supabase Status](https://status.supabase.com/)
2. Search [Supabase Discussions](https://github.com/supabase/supabase/discussions)
3. Join [Supabase Discord](https://discord.supabase.com)
4. Review Cozy Growth [GitHub Issues](https://github.com/yourusername/cozy-growth/issues)

---

**Happy Building! 🌱**
