# Moyassar Payment Data Validation Fix

## ✅ What I Fixed

1. **Added `source` field** - Moyassar requires a `source` object to specify payment method
2. **Improved error handling** - Now shows detailed validation errors from Moyassar
3. **Better logging** - Full response is logged for debugging

## 🔧 Changes Made

The payment request now includes:
```javascript
{
  amount: 9999, // in halalas
  currency: "SAR",
  description: "Subscription: Premium Plan",
  source: {
    type: "creditcard"  // Required by Moyassar
  },
  metadata: {
    subscription_id: "...",
    ...
  },
  callback_url: "..." // if configured
}
```

## 🧪 Test Again

Try your request again:
```
POST /api/payment/moyassar/initiate
Authorization: Bearer <your_token>
Body: { "subscriptionId": "6926e257548a832b8cc8b239" }
```

## 📋 Check Server Logs

After making the request, check your server console. You should now see:

1. **Request details:**
   ```
   Moyassar API Request: {
     url: '...',
     paymentData: { ... }
   }
   ```

2. **Response details:**
   ```
   Moyassar API Response: { ... }
   ```

3. **If error occurs, detailed validation errors:**
   ```
   Moyassar validation error: field_name: error message
   ```

## ⚠️ If Still Failing

If you still get "Data validation failed", check the server logs for the detailed error message. It will tell you exactly which field is wrong.

Common issues:
- **Amount format** - Must be in halalas (SAR * 100)
- **Currency** - Must be valid (SAR, USD, etc.)
- **Source type** - Might need to be different (e.g., "invoice" instead of "creditcard")
- **Required fields** - Moyassar might require additional fields

## 🔄 Alternative: Using Invoice API

If payment API doesn't work, Moyassar might require using their Invoice API for payment links. Let me know if you need me to implement that alternative.

---

**Try the request again and check the server logs for detailed error messages!** 🚀

