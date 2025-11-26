# Subscription Expiry Auto-Update Setup

This document explains how the automatic subscription expiry system works and how to set it up.

## How It Works

The system automatically updates expired subscriptions in two ways:

### 1. **On-Demand Updates (Middleware)**
When a user tries to access a protected route, the `verifySubscription` middleware:
- Checks if their subscription has expired
- If expired, automatically sets `isActive: false`
- Denies access if no valid subscription exists

**This happens automatically** - no setup required!

### 2. **Scheduled Updates (Optional)**
A scheduled job can run periodically to update all expired subscriptions in bulk.

---

## Setup Options

### Option 1: Middleware Only (Already Active) ✅

The middleware automatically updates expired subscriptions when users try to access protected routes. **This is already working** - no additional setup needed!

**Pros:**
- No additional dependencies
- Updates happen when needed
- No extra server resources

**Cons:**
- Only updates when users access protected routes
- Expired subscriptions remain "active" until accessed

---

### Option 2: Scheduled Job (Recommended for Production)

Run a scheduled job to update expired subscriptions periodically (e.g., daily at midnight).

#### Step 1: Install node-cron

```bash
npm install node-cron
```

#### Step 2: Enable the job in server.js

Add this to your `server.js` file:

```javascript
// After database connection
const startServer = async () => {
  try {
    await connectDB();
    
    // Start subscription expiry job (optional)
    if (process.env.ENABLE_SUBSCRIPTION_CRON === 'true') {
      const { startSubscriptionExpiryJob } = require('./jobs/subscriptionExpiry.job');
      startSubscriptionExpiryJob();
    }
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};
```

#### Step 3: Add to .env (optional)

```env
ENABLE_SUBSCRIPTION_CRON=true
```

**Schedule Options:**
- **Daily at midnight:** `startSubscriptionExpiryJob()` (default)
- **Every hour:** `startSubscriptionExpiryJobHourly()`

---

### Option 3: Manual Script

Run the update script manually or via system cron:

```bash
# Run manually
node scripts/updateExpiredSubscriptions.js

# Or add to system cron (Linux/Mac)
# Edit crontab: crontab -e
# Add this line to run daily at midnight:
0 0 * * * cd /path/to/project && node scripts/updateExpiredSubscriptions.js
```

---

## Files Created

1. **`services/subscription/subscription.service.js`**
   - `updateExpiredSubscriptions()` - Updates all expired subscriptions
   - `getExpiredSubscriptionsCount()` - Gets count of expired subscriptions

2. **`middlewares/subscription/verifySubscription.middleware.js`**
   - Updated to auto-update expired subscriptions on access

3. **`scripts/updateExpiredSubscriptions.js`**
   - Standalone script for manual/scheduled execution

4. **`jobs/subscriptionExpiry.job.js`**
   - Scheduled job using node-cron (optional)

---

## Testing

### Test the middleware update:

1. Create a subscription with an expiry date in the past
2. Try to access a protected route
3. Check the database - `isActive` should be `false`

### Test the scheduled job:

1. Create expired subscriptions
2. Run: `node scripts/updateExpiredSubscriptions.js`
3. Check the database - all expired subscriptions should have `isActive: false`

---

## Database Query

The system finds and updates subscriptions where:
- `isActive: true`
- `expiryDate < currentDate`

```javascript
await Subscription.updateMany(
  {
    isActive: true,
    expiryDate: { $lt: currentDate },
  },
  {
    $set: { isActive: false },
  }
);
```

---

## Recommendation

For most applications, **Option 1 (Middleware)** is sufficient because:
- Updates happen automatically when needed
- No additional dependencies
- No extra server load

Use **Option 2 (Scheduled Job)** if you:
- Want to keep the database clean
- Need to run reports on expired subscriptions
- Want to ensure all expired subscriptions are updated even if users don't access protected routes

