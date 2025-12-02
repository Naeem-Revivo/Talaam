# Vercel PostgreSQL Deployment Guide

This guide explains how to deploy your Talaam Project server with PostgreSQL on Vercel.

## Prerequisites

1. A Vercel account
2. Vercel CLI installed (optional, for local testing)
3. Your project repository connected to Vercel

## Step 1: Add Vercel Postgres Database

1. Go to your Vercel project dashboard
2. Navigate to the **Storage** tab
3. Click **Create Database** → Select **Postgres**
4. Choose your plan (Hobby, Pro, or Enterprise)
5. Select a region closest to your users
6. Click **Create**

Vercel will automatically provide these environment variables:
- `POSTGRES_PRISMA_URL` - Pooled connection (for Prisma Client)
- `POSTGRES_URL` - Direct connection
- `POSTGRES_URL_NON_POOLING` - Non-pooling connection (for migrations)

## Step 2: Configure Environment Variables

In your Vercel project settings, add the following environment variables:

### Required Database Variables
Vercel automatically sets these when you add Postgres, but you need to set `DATABASE_URL`:

```
DATABASE_URL=${POSTGRES_PRISMA_URL}
```

This ensures Prisma schema can access the connection string.

### Other Required Variables

Add all your application environment variables in Vercel:

1. Go to **Settings** → **Environment Variables**
2. Add the following (adjust values as needed):

```
# Database (set to use Vercel Postgres pooled connection)
DATABASE_URL=${POSTGRES_PRISMA_URL}

# JWT Configuration
JWT_SECRET=your-secure-jwt-secret-key
JWT_EXPIRES_IN=7d

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Configuration (if using)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password

# Moyassar Payment (if using)
MOYASSAR_API_KEY=your-moyassar-api-key
MOYASSAR_SECRET_KEY=your-moyassar-secret-key
MOYASSAR_BASE_URL=https://api.moyassar.com

# Frontend URL
FRONTEND_URL=https://your-frontend-domain.vercel.app

# Node Environment
NODE_ENV=production

# Subscription Cron (optional - Vercel handles cron jobs separately)
ENABLE_SUBSCRIPTION_CRON=false
```

**Important**: Set `DATABASE_URL=${POSTGRES_PRISMA_URL}` to use the pooled connection.

## Step 3: Run Database Migrations

Before deploying, you need to run Prisma migrations to set up your database schema.

### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Link your project
vercel link

# Pull environment variables (includes Postgres connection strings)
vercel env pull .env.local

# Run migrations
cd server
npx prisma migrate deploy
```

### Option B: Using Vercel Dashboard

1. Go to your project settings
2. Navigate to **Deployments**
3. Create a new deployment or use the latest one
4. The build process will run `prisma generate` automatically
5. For migrations, you can:
   - Use Vercel's CLI (see Option A)
   - Or create a one-time migration script that runs on deployment

### Option C: Create a Migration Endpoint

You can create a temporary API endpoint to run migrations:

```javascript
// server/api/migrate.js
const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Add authentication/authorization here
  const authToken = req.headers.authorization;
  if (authToken !== `Bearer ${process.env.MIGRATION_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    execSync('npx prisma migrate deploy', { 
      cwd: __dirname + '/../',
      stdio: 'inherit' 
    });
    res.json({ success: true, message: 'Migrations completed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

Then add to `vercel.json`:
```json
{
  "routes": [
    {
      "src": "/api/migrate",
      "dest": "api/migrate.js"
    }
  ]
}
```

## Step 4: Deploy

1. Push your code to your connected Git repository
2. Vercel will automatically deploy
3. Or deploy manually using Vercel CLI:
   ```bash
   vercel --prod
   ```

## Step 5: Verify Deployment

1. Check your deployment logs in Vercel dashboard
2. Test your API endpoints
3. Verify database connection:
   ```bash
   curl https://your-api.vercel.app/api/health
   ```

## Connection Pooling

The configuration uses connection pooling optimized for serverless:

- **Pooled Connection** (`POSTGRES_PRISMA_URL`): Used for all Prisma Client queries
- **Direct Connection** (`POSTGRES_URL_NON_POOLING`): Used for migrations
- **Max Connections**: Limited to 1 in serverless environment to prevent connection exhaustion

## Troubleshooting

### Migration Issues

If migrations fail:
1. Ensure `POSTGRES_URL_NON_POOLING` is set in Vercel
2. Check that `directUrl` in `schema.prisma` points to `POSTGRES_URL_NON_POOLING`
3. Run migrations locally with Vercel environment variables

### Connection Timeout

If you see connection timeouts:
1. Verify all environment variables are set correctly
2. Check that `DATABASE_URL` is set to `POSTGRES_PRISMA_URL`
3. Ensure SSL is enabled (handled automatically by Vercel)

### Prisma Client Not Generated

If Prisma Client is missing:
1. The `postinstall` script in `package.json` should run `prisma generate`
2. Check build logs to ensure it runs
3. Manually add to `vercel.json` build command if needed

## Additional Resources

- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

