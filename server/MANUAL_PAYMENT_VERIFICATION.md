# Manual Payment Verification Guide

## 🔴 Current Issue

After successful payment, subscription status is still:
- `paymentStatus: "Pending"`
- `isActive: false`
- `transactionId: null`

This means the webhook didn't fire or wasn't processed.

---

## ✅ Solution: Manual Verification

Since the webhook might not be working, you can manually verify the payment using the verify endpoint.

### Step 1: Get Your Invoice ID

From your payment initiation response, you have:
- **Invoice ID**: `d540b2c7-074b-4e1e-be59-80cd0f543912`
- **Subscription ID**: `6926e257548a832b8cc8b239`

### Step 2: Verify Payment Manually

**Request:**
```
POST /api/payment/moyassar/verify
Authorization: Bearer <your_token>
Content-Type: application/json

Body:
{
  "paymentId": "d540b2c7-074b-4e1e-be59-80cd0f543912",
  "subscriptionId": "6926e257548a832b8cc8b239"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "subscription": {
      "id": "6926e257548a832b8cc8b239",
      "paymentStatus": "Paid",
      "isActive": true,
      "transactionId": "d540b2c7-074b-4e1e-be59-80cd0f543912",
      "moyassarPaymentStatus": "paid"
    }
  }
}
```

---

## 🔧 Why Webhook Might Not Work

### Issue 1: Webhook URL Not Configured in Moyassar Dashboard

**Fix:**
1. Go to Moyassar Dashboard → Settings → Webhooks
2. Add webhook URL: `https://your-domain.com/api/payment/moyassar/webhook`
3. Enable webhook events for invoices

### Issue 2: Callback URL vs Webhook URL

**Important:** 
- `callback_url` in invoice = redirect URL after payment (for user)
- Webhook URL = configured in Moyassar dashboard (for server notifications)

These are **different**! Make sure webhook is configured separately in dashboard.

### Issue 3: ngrok URL Changed

If you're using ngrok for local testing:
- ngrok URLs change when you restart
- Update webhook URL in Moyassar dashboard when ngrok URL changes
- For production, use your permanent domain

---

## 🧪 Testing Webhook

### Check if Webhook is Being Received

Look in your server logs for:
```
🔔 Moyassar webhook received
📦 Body: { ... }
```

If you don't see this, webhook is not reaching your server.

### Test Webhook Endpoint

Test if your webhook endpoint is accessible:
```bash
curl -X POST https://your-domain.com/api/payment/moyassar/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

---

## 📋 Quick Fix Steps

### For Current Payment:

1. **Manually verify the payment:**
   ```
   POST /api/payment/moyassar/verify
   Body: {
     "paymentId": "d540b2c7-074b-4e1e-be59-80cd0f543912",
     "subscriptionId": "6926e257548a832b8cc8b239"
   }
   ```

2. **Check subscription status:**
   ```
   GET /api/subscription/me
   ```

### For Future Payments:

1. **Configure webhook in Moyassar Dashboard:**
   - URL: `https://your-domain.com/api/payment/moyassar/webhook`
   - Enable invoice payment events

2. **Or use manual verification:**
   - After user completes payment, call verify endpoint
   - This can be done automatically in your frontend

---

## 💡 Frontend Integration Suggestion

After user completes payment on Moyassar checkout page, they're redirected back. You can:

1. **Check payment status on redirect:**
   ```javascript
   // After user returns from payment
   const invoiceId = getInvoiceIdFromUrl(); // from redirect URL
   const subscriptionId = getSubscriptionId(); // from your state
   
   // Verify payment
   await fetch('/api/payment/moyassar/verify', {
     method: 'POST',
     headers: {
       'Authorization': `Bearer ${token}`,
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       paymentId: invoiceId,
       subscriptionId: subscriptionId
     })
   });
   ```

2. **Poll for payment status:**
   ```javascript
   // Poll every 2 seconds for 30 seconds
   const checkPayment = async () => {
     const response = await fetch(`/api/payment/moyassar/status/${subscriptionId}`);
     const data = await response.json();
     
     if (data.data.subscription.paymentStatus === 'Paid') {
       // Payment successful!
       return;
     }
   };
   ```

---

## ✅ What I Fixed in Code

1. **Better invoice status checking** - Now checks `payments` array for paid payments
2. **Improved callback URL handling** - Ensures correct webhook URL format
3. **Enhanced logging** - Better webhook debugging

---

**For now, use the manual verification endpoint to update the subscription status!** 🚀

