# Webhook Debugging Guide

## 🔍 Why Webhook Might Not Be Working

### 1. **Webhook URL Not Configured in Moyassar Dashboard**

**Check:**
- Go to Moyassar Dashboard → Settings → Webhooks
- Verify webhook URL is set: `https://talaam-4sa4.vercel.app/api/payment/moyassar/webhook`
- Make sure it's **enabled** and **active**

**Fix:**
- Add/update webhook URL in Moyassar dashboard
- Enable webhook events for invoice payments

---

### 2. **Webhook URL Mismatch**

**Check your `.env` file:**
```env
MOYASSAR_WEBHOOK_URL=https://talaam-4sa4.vercel.app/api/payment/moyassar/webhook
```

**Verify:**
- URL matches your actual server URL
- No typos (moyasar vs moyassar)
- HTTPS is used (not HTTP)
- Path is correct: `/api/payment/moyassar/webhook`

---

### 3. **Webhook Not Being Received**

**Check Server Logs:**
Look for:
```
🔔 Moyassar webhook received
```

**If you don't see this:**
- Webhook is not reaching your server
- Check Moyassar dashboard for webhook delivery status
- Verify server is accessible from internet (for Vercel, should be fine)
- Check if webhook URL is publicly accessible

---

### 4. **Webhook Payload Structure Issue**

**Check Server Logs:**
You should see:
```
📦 Full webhook payload: { ... }
```

**Common Issues:**
- Subscription ID not in metadata
- Payment/Invoice ID in different location
- Webhook format different than expected

**Solution:**
The improved handler now:
- Tries multiple locations for subscription_id
- Falls back to searching by payment ID if metadata missing
- Logs full payload for debugging

---

### 5. **Subscription Not Found**

**Check Logs:**
```
⚠️  Subscription ID not in webhook metadata, searching by payment/invoice ID...
```

**If subscription not found:**
- Payment was created but subscription doesn't exist
- Payment ID doesn't match stored moyassarPaymentId
- Database connection issue

---

## 🧪 Testing Webhook

### Option 1: Check Moyassar Dashboard

1. Go to Moyassar Dashboard
2. Navigate to Webhooks section
3. Check webhook delivery logs
4. See if webhook was sent and what response was received

### Option 2: Check Server Logs

After a payment, check your server logs for:
```
🔔 Moyassar webhook received
📋 Headers: { ... }
📦 Body: { ... }
✅ Extracted from webhook: { paymentId: ..., subscriptionId: ... }
✅ Webhook processed successfully
```

### Option 3: Manual Verification

If webhook didn't fire, manually verify:
```
POST /api/payment/moyassar/verify
Authorization: Bearer <token>
Body: {
  "paymentId": "b82004ae-7ada-47bc-b2b7-1a06f4a53063",
  "subscriptionId": "6926e257548a832b8cc8b239"
}
```

---

## 🔧 Fixing Webhook Issues

### Step 1: Verify Webhook URL in Moyassar

1. Login to Moyassar Dashboard
2. Go to Settings → Webhooks
3. Add/Update webhook URL:
   ```
   https://talaam-4sa4.vercel.app/api/payment/moyassar/webhook
   ```
4. Enable webhook events:
   - Invoice paid
   - Invoice updated
   - Payment succeeded

### Step 2: Test Webhook Endpoint

Test if your webhook endpoint is accessible:
```bash
curl -X POST https://talaam-4sa4.vercel.app/api/payment/moyassar/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

Should return:
```json
{
  "success": false,
  "message": "Webhook received but processing failed",
  "error": "..."
}
```

### Step 3: Check Server Logs

After making a test payment, check your server logs (Vercel logs or local server console) for webhook activity.

---

## 📋 Webhook Payload Examples

### Invoice Webhook (Expected Format):
```json
{
  "id": "b82004ae-7ada-47bc-b2b7-1a06f4a53063",
  "status": "paid",
  "amount": 9999,
  "currency": "SAR",
  "metadata": {
    "subscription_id": "6926e257548a832b8cc8b239",
    "user_id": "...",
    "plan_id": "..."
  }
}
```

### Payment Webhook (Alternative Format):
```json
{
  "payment": {
    "id": "...",
    "status": "paid",
    "metadata": {
      "subscription_id": "..."
    }
  }
}
```

---

## ✅ What the Improved Handler Does

1. **Multiple ID Extraction:**
   - Tries `id`, `payment.id`, `invoice.id`, `invoice_id`, `data.id`, `object.id`

2. **Multiple Subscription ID Extraction:**
   - Tries `metadata.subscription_id`, `payment.metadata.subscription_id`, etc.

3. **Fallback Search:**
   - If subscription_id not in metadata, searches database by payment ID
   - Looks in `moyassarPaymentId` and `transactionId` fields

4. **Better Logging:**
   - Logs full webhook payload
   - Logs extraction process
   - Logs success/failure with details

---

## 🚨 Common Error Messages

### "Payment/Invoice ID not found in webhook data"
- Webhook payload structure is unexpected
- Check logs for full payload structure
- May need to adjust extraction logic

### "Subscription ID not found in webhook data"
- Metadata not included in webhook
- Subscription not found by payment ID
- Check if subscription was created with correct payment ID

### "Subscription not found"
- Subscription doesn't exist in database
- Payment ID doesn't match stored ID
- Database connection issue

---

## 📞 Next Steps

1. **Check Moyassar Dashboard** - Verify webhook is configured
2. **Check Server Logs** - See if webhook is being received
3. **Check Webhook Payload** - See what data Moyassar is sending
4. **Manual Verification** - Use verify endpoint as backup
5. **Contact Moyassar Support** - If webhook format is different than expected

---

**The improved handler should now work better! Check your server logs after the next payment to see detailed webhook processing information.** 🔍

