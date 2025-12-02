# Vercel Database Connection Troubleshooting

## Error: "Can't reach database server at base"

This error indicates that Prisma cannot connect to your Vercel Postgres database. Follow these steps to fix it:

### Step 1: Verify Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Verify these variables are set:

**Required Variables:**
- `POSTGRES_PRISMA_URL` - Should be automatically set when you add Vercel Postgres
- `POSTGRES_URL_NON_POOLING` - Should be automatically set
- `DATABASE_URL` - Optional, but recommended: Set to `${POSTGRES_PRISMA_URL}`

**Check:**
- Make sure variables are set for **Production**, **Preview**, and **Development** environments
- Verify the values are not empty
- Check that `POSTGRES_PRISMA_URL` starts with `postgresql://`

### Step 2: Verify Vercel Postgres is Active

1. Go to **Storage** tab in Vercel dashboard
2. Check that your Postgres database is:
   - Created and active
   - In the same region as your deployment
   - Not paused or suspended

### Step 3: Check Connection String Format

The connection string should look like:
```
postgresql://user:password@host:port/database?pgbouncer=true&connect_timeout=15
```

**Common Issues:**
- Missing `?pgbouncer=true` parameter (required for pooled connections)
- Wrong host/port
- Missing SSL parameters

### Step 4: Verify Build Logs

1. Go to your deployment in Vercel
2. Check **Build Logs** for:
   - Prisma Client generation errors
   - Environment variable loading errors
   - Connection string format errors

Look for these log messages:
- `🔌 Database connection:` - Shows which connection string is being used
- `✅ PostgreSQL Connected via Prisma` - Confirms successful connection
- `❌ PostgreSQL connection error:` - Shows connection failure details

### Step 5: Test Connection Locally

Pull Vercel environment variables and test locally:

```bash
# Install Vercel CLI
npm i -g vercel

# Link project
cd server
vercel link

# Pull environment variables
vercel env pull .env.local

# Test connection
npx prisma db pull
```

### Step 6: Check SSL Configuration

Vercel Postgres requires SSL. The configuration should automatically enable SSL when:
- `VERCEL=1` is set, OR
- `NODE_ENV=production`

Verify in your Vercel environment variables:
- `VERCEL=1` should be automatically set
- `NODE_ENV=production` should be set

### Step 7: Verify Prisma Configuration

Check that `prisma.config.ts` is correctly configured:

```typescript
// Should use POSTGRES_PRISMA_URL if available
const connectionUrl = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;
```

### Step 8: Check Network/Firewall Issues

- Ensure your Vercel Postgres database allows connections from Vercel functions
- Check if there are any IP restrictions on your database
- Verify the database region matches your deployment region

### Step 9: Redeploy After Fixes

After making changes:
1. Save all environment variables
2. Redeploy your application
3. Check the new deployment logs

### Step 10: Check Function Logs

1. Go to **Functions** tab in Vercel
2. Click on a function execution
3. Check **Logs** for detailed error messages

## Common Solutions

### Solution 1: Missing POSTGRES_PRISMA_URL
**Problem:** `POSTGRES_PRISMA_URL` is not set in Vercel

**Fix:**
1. Add Vercel Postgres database (if not added)
2. Vercel automatically sets `POSTGRES_PRISMA_URL`
3. Or manually set `DATABASE_URL` to your Postgres connection string

### Solution 2: Wrong Environment Scope
**Problem:** Variables are only set for one environment

**Fix:**
1. Edit each environment variable
2. Select all environments: Production, Preview, Development
3. Save and redeploy

### Solution 3: Connection Pool Exhausted
**Problem:** Too many connections in serverless

**Fix:**
- The configuration already limits to 1 connection in serverless
- If still having issues, check for connection leaks

### Solution 4: Prisma Client Not Generated
**Problem:** Prisma Client is missing or outdated

**Fix:**
1. Check `vercel.json` has: `"buildCommand": "npm install && npx prisma generate"`
2. Verify `package.json` has: `"postinstall": "prisma generate"`
3. Redeploy to regenerate Prisma Client

## Debugging Commands

### Check Environment Variables
```bash
vercel env ls
```

### Pull and Test Locally
```bash
vercel env pull .env.local
cat .env.local | grep POSTGRES
npx prisma db pull
```

### Test Connection
```bash
node -e "require('dotenv').config({path:'.env.local'}); console.log(process.env.POSTGRES_PRISMA_URL ? 'Found' : 'Missing')"
```

## Still Having Issues?

1. Check Vercel Status: https://vercel-status.com
2. Review Vercel Postgres Documentation: https://vercel.com/docs/storage/vercel-postgres
3. Check Prisma Logs in deployment logs
4. Contact Vercel Support with:
   - Deployment URL
   - Error logs
   - Environment variable names (not values)

