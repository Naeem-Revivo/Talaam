# Moyassar "Invalid Authorization Credentials" - Troubleshooting Guide

## 🔴 Error: "Invalid authorization credentials"

This error occurs when Moyassar API rejects your authentication. Here's how to fix it:

---

## ✅ Step 1: Verify Your .env File

Make sure your `.env` file has all required Moyassar variables:

```env
MOYASSAR_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
MOYASSAR_SECRET_KEY=sk_test_xxxxxxxxxxxxx
MOYASSAR_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
MOYASSAR_API_URL=https://api.moyasar.com/v1
MOYASSAR_ENVIRONMENT=sandbox
MOYASSAR_WEBHOOK_URL=https://yourdomain.com/api/payment/moyassar/webhook
```

**Important:**
- ✅ No spaces around the `=` sign
- ✅ No quotes around the values (unless the value itself contains spaces)
- ✅ Make sure there are no extra characters or typos

---

## ✅ Step 2: Test Your Configuration

Run the test script to verify your configuration:

```bash
node scripts/testMoyassarConfig.js
```

This will show you:
- Which variables are set
- Which variables are missing
- If your secret key format is correct
- If authentication header can be generated

---

## ✅ Step 3: Verify Your Secret Key

### Check in Moyassar Dashboard:

1. Go to: https://dashboard.moyasar.com/
2. Login to your account
3. Navigate to: **Settings** → **API Keys**
4. Copy your **Secret Key** (starts with `sk_test_` for sandbox or `sk_live_` for production)

### Verify the Key Format:

- **Sandbox (Test)**: Should start with `sk_test_`
- **Production (Live)**: Should start with `sk_live_`
- **Length**: Usually 40-50 characters

### Common Issues:

❌ **Wrong Key Type**: Using publishable key instead of secret key
- Publishable key starts with `pk_test_` or `pk_live_`
- Secret key starts with `sk_test_` or `sk_live_`
- **Solution**: Use the SECRET KEY, not the publishable key

❌ **Key from Wrong Environment**: Using production key in sandbox or vice versa
- **Solution**: Make sure `MOYASSAR_ENVIRONMENT` matches your key type

❌ **Key Has Extra Spaces**: Copy-paste might include spaces
- **Solution**: Remove any leading/trailing spaces from the key

---

## ✅ Step 4: Restart Your Server

After updating `.env` file:

1. **Stop your server** (Ctrl+C)
2. **Restart your server**:
   ```bash
   npm start
   # or
   npm run dev
   ```

**Important**: Environment variables are loaded when the server starts. Changes to `.env` won't take effect until you restart.

---

## ✅ Step 5: Check Server Logs

When you try to initiate a payment, check the server console. You should see:

```
Moyassar API Request: {
  url: 'https://api.moyasar.com/v1/payments',
  amount: 9999,
  currency: 'SAR',
  hasAuth: true,
  secretKeyPrefix: 'sk_test_12...'
}
```

If you see:
- `hasAuth: false` → Secret key is not loaded
- `secretKeyPrefix: undefined...` → Secret key is missing

---

## ✅ Step 6: Test with cURL

Test your credentials directly with Moyassar API:

```bash
# Replace YOUR_SECRET_KEY with your actual secret key
curl -X GET https://api.moyasar.com/v1/payments \
  -H "Authorization: Basic $(echo -n 'YOUR_SECRET_KEY:' | base64)" \
  -H "Content-Type: application/json"
```

**Expected Response:**
- ✅ `200 OK` with payments list → Credentials are correct
- ❌ `401 Unauthorized` → Credentials are wrong

---

## ✅ Step 7: Verify Authentication Format

The authentication header should be:
```
Authorization: Basic <base64_encoded_secret_key:>
```

**Example:**
- Secret Key: `sk_test_1234567890`
- Encoded: `c2tfdGVzdF8xMjM0NTY3ODkwOg==`
- Header: `Authorization: Basic c2tfdGVzdF8xMjM0NTY3ODkwOg==`

The code automatically does this, but you can verify by checking the logs.

---

## 🔍 Common Issues & Solutions

### Issue 1: Secret Key Not Loading

**Symptoms:**
- Error: "Moyassar secret key is not configured"
- `hasAuth: false` in logs

**Solutions:**
1. Check `.env` file exists in the server root directory
2. Verify variable name is exactly `MOYASSAR_SECRET_KEY` (case-sensitive)
3. Restart server after updating `.env`
4. Check if `.env` is in `.gitignore` (it should be)

---

### Issue 2: Wrong Secret Key

**Symptoms:**
- Error: "Invalid authorization credentials"
- `401 Unauthorized` from Moyassar API

**Solutions:**
1. Get fresh key from Moyassar dashboard
2. Make sure you're using Secret Key (not Publishable Key)
3. Verify key matches your environment (test vs live)
4. Check for typos or extra characters

---

### Issue 3: Environment Mismatch

**Symptoms:**
- Using `sk_live_` key but `MOYASSAR_ENVIRONMENT=sandbox`

**Solutions:**
1. Use `sk_test_` key for sandbox
2. Use `sk_live_` key for production
3. Match `MOYASSAR_ENVIRONMENT` to your key type

---

### Issue 4: API URL Wrong

**Symptoms:**
- Connection errors
- 404 Not Found

**Solutions:**
1. Verify `MOYASSAR_API_URL=https://api.moyasar.com/v1`
2. No trailing slash
3. Use `https://` not `http://`

---

## 🧪 Quick Test

Run this in your Node.js console (after starting server):

```javascript
require('dotenv').config();
const { MOYASSAR_CONFIG } = require('./config/moyassar');

console.log('Secret Key:', MOYASSAR_CONFIG.secretKey ? '✅ Set' : '❌ Missing');
console.log('Key Preview:', MOYASSAR_CONFIG.secretKey?.substring(0, 15) + '...');
console.log('API URL:', MOYASSAR_CONFIG.apiUrl);
```

---

## 📞 Still Not Working?

If you've tried all the above:

1. **Double-check Moyassar Dashboard**:
   - Login and verify your account is active
   - Check if API access is enabled
   - Verify you're using the correct account

2. **Contact Moyassar Support**:
   - Provide them with the error message
   - Ask them to verify your API keys are active
   - Check if there are any account restrictions

3. **Check Moyassar Status**:
   - Visit Moyassar status page (if available)
   - Check for any service outages

---

## ✅ Verification Checklist

Before testing payment:

- [ ] `.env` file exists in server root
- [ ] `MOYASSAR_SECRET_KEY` is set in `.env`
- [ ] Secret key starts with `sk_test_` or `sk_live_`
- [ ] No extra spaces in the key
- [ ] `MOYASSAR_API_URL=https://api.moyasar.com/v1`
- [ ] Server restarted after updating `.env`
- [ ] Test script passes: `node scripts/testMoyassarConfig.js`
- [ ] Server logs show `hasAuth: true`

---

**Once all checks pass, try initiating a payment again!** 🚀

