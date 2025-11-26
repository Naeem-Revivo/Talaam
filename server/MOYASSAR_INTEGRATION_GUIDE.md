# Moyassar Payment Gateway Integration Guide

## ✅ Integration Complete!

The Moyassar payment gateway has been successfully integrated into your Talaam Project server.

---

## 📁 Files Created/Modified

### New Files Created:
1. **Configuration**
   - `config/moyassar/moyassar.config.js` - Moyassar configuration
   - `config/moyassar/index.js` - Config exports

2. **Services**
   - `services/payment/moyassar.service.js` - Moyassar API integration
   - `services/payment/index.js` - Service exports

3. **Controllers**
   - `controllers/payment/payment.controller.js` - Payment endpoints
   - `controllers/payment/index.js` - Controller exports

4. **Middleware**
   - `middlewares/payment/payment.middleware.js` - Payment validation & webhook verification
   - `middlewares/payment/index.js` - Middleware exports

5. **Routes**
   - `routes/payment/payment.routes.js` - Payment API routes
   - `routes/payment/index.js` - Route exports

### Modified Files:
1. `models/subscription/Subscription.model.js` - Added Moyassar payment fields
2. `server.js` - Registered payment routes

---

## 🔌 API Endpoints

### 1. Initiate Payment
**POST** `/api/payment/moyassar/initiate`

Initiates a Moyassar payment for a subscription.

**Headers:**
```
Authorization: Bearer <user_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "subscriptionId": "507f1f77bcf86cd799439012"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Payment initiated successfully",
  "data": {
    "paymentId": "moyassar_payment_id_123",
    "paymentUrl": "https://moyassar.com/payment/...",
    "subscription": {
      "id": "507f1f77bcf86cd799439012",
      "paymentStatus": "Pending",
      "moyassarPaymentStatus": "initiated"
    }
  }
}
```

---

### 2. Verify Payment
**POST** `/api/payment/moyassar/verify`

Manually verify payment status (alternative to webhook).

**Headers:**
```
Authorization: Bearer <user_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "paymentId": "moyassar_payment_id_123",
  "subscriptionId": "507f1f77bcf86cd799439012"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "subscription": {
      "id": "507f1f77bcf86cd799439012",
      "paymentStatus": "Paid",
      "isActive": true,
      "transactionId": "moyassar_payment_id_123",
      "moyassarPaymentStatus": "paid"
    }
  }
}
```

---

### 3. Get Payment Status
**GET** `/api/payment/moyassar/status/:subscriptionId`

Get current payment status for a subscription.

**Headers:**
```
Authorization: Bearer <user_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": "507f1f77bcf86cd799439012",
      "paymentStatus": "Paid",
      "isActive": true,
      "moyassarPaymentStatus": "paid",
      "paymentUrl": "https://moyassar.com/payment/...",
      "transactionId": "moyassar_payment_id_123"
    },
    "payment": {
      "id": "moyassar_payment_id_123",
      "status": "paid",
      "amount": 9999,
      "currency": "SAR"
    }
  }
}
```

---

### 4. Webhook Endpoint (Public)
**POST** `/api/payment/moyassar/webhook`

Receives payment status updates from Moyassar. **This endpoint is public but signature-verified.**

**Note:** Configure this URL in your Moyassar dashboard:
- Go to Moyassar Dashboard → Settings → Webhooks
- Add webhook URL: `https://yourdomain.com/api/payment/moyassar/webhook`

**Response:**
```json
{
  "success": true,
  "message": "Webhook processed successfully"
}
```

---

## 🔄 Complete Payment Flow

### Flow 1: Webhook-Based (Recommended)

1. **User subscribes to plan:**
   ```
   POST /api/subscription/subscribe
   Body: { "planId": "..." }
   ```
   - Creates subscription with `paymentStatus: 'Pending'`

2. **Initiate payment:**
   ```
   POST /api/payment/moyassar/initiate
   Body: { "subscriptionId": "..." }
   ```
   - Returns `paymentUrl`

3. **User completes payment:**
   - Frontend redirects user to `paymentUrl`
   - User completes payment on Moyassar

4. **Webhook received:**
   - Moyassar sends webhook to `/api/payment/moyassar/webhook`
   - Backend automatically updates subscription to `Paid` and `isActive: true`

5. **User returns to app:**
   - Frontend can check subscription status
   - User now has access to premium features

---

### Flow 2: Manual Verification

1. **User subscribes to plan:**
   ```
   POST /api/subscription/subscribe
   ```

2. **Initiate payment:**
   ```
   POST /api/payment/moyassar/initiate
   ```

3. **User completes payment:**
   - User completes payment on Moyassar
   - User returns to your app

4. **Verify payment:**
   ```
   POST /api/payment/moyassar/verify
   Body: {
     "paymentId": "...",
     "subscriptionId": "..."
   }
   ```
   - Backend verifies payment and updates subscription

---

## 📊 Subscription Model Updates

The Subscription model now includes these Moyassar fields:

```javascript
{
  // Existing fields...
  paymentMethod: 'moyassar' | 'manual',
  moyassarPaymentId: String,
  moyassarPaymentStatus: 'initiated' | 'paid' | 'failed' | 'cancelled',
  paymentUrl: String
}
```

---

## 🔐 Security Features

1. **Webhook Signature Verification**
   - Webhooks are verified using the webhook secret
   - Invalid signatures are rejected

2. **User Authorization**
   - All payment endpoints require authentication
   - Users can only access their own subscriptions

3. **Payment Validation**
   - Payment amounts are validated server-side
   - Subscription ownership is verified

---

## 🧪 Testing

### Test Payment Flow:

1. **Create a subscription:**
   ```bash
   POST /api/subscription/subscribe
   Authorization: Bearer <token>
   { "planId": "your_plan_id" }
   ```

2. **Initiate payment:**
   ```bash
   POST /api/payment/moyassar/initiate
   Authorization: Bearer <token>
   { "subscriptionId": "subscription_id" }
   ```

3. **Check payment status:**
   ```bash
   GET /api/payment/moyassar/status/:subscriptionId
   Authorization: Bearer <token>
   ```

### Test Cards (Sandbox):
Use test card numbers from Moyassar documentation for sandbox testing.

---

## ⚙️ Environment Variables

Make sure these are set in your `.env` file:

```env
MOYASSAR_PUBLISHABLE_KEY=pk_test_...
MOYASSAR_SECRET_KEY=sk_test_...
MOYASSAR_WEBHOOK_SECRET=whsec_...
MOYASSAR_API_URL=https://api.moyasar.com/v1
MOYASSAR_ENVIRONMENT=sandbox
MOYASSAR_WEBHOOK_URL=https://yourdomain.com/api/payment/moyassar/webhook
```

---

## 🚀 Next Steps

1. **Configure Webhook in Moyassar Dashboard:**
   - Add webhook URL: `https://yourdomain.com/api/payment/moyassar/webhook`
   - Enable webhook events for payment status updates

2. **Test the Integration:**
   - Test payment flow in sandbox mode
   - Verify webhook delivery
   - Test payment verification

3. **Frontend Integration:**
   - Call `/api/payment/moyassar/initiate` after subscription creation
   - Redirect user to `paymentUrl` returned in response
   - Handle payment completion callback

4. **Production Deployment:**
   - Switch to production API keys
   - Update `MOYASSAR_ENVIRONMENT=production`
   - Update webhook URL to production domain

---

## 📝 Notes

- **Currency**: Currently set to SAR (Saudi Riyal). Change in `config/moyassar/moyassar.config.js` if needed.
- **Amount Conversion**: Moyassar uses halalas (1 SAR = 100 halalas). The service automatically converts.
- **Webhook**: Recommended for automatic payment processing. Manual verification is also available.
- **Error Handling**: All errors are logged and user-friendly messages are returned.

---

## 🆘 Troubleshooting

### Payment not initiating?
- Check API keys in `.env`
- Verify subscription exists and belongs to user
- Check Moyassar API status

### Webhook not working?
- Verify webhook URL is configured in Moyassar dashboard
- Check webhook secret matches
- Ensure webhook endpoint is publicly accessible
- Check server logs for webhook errors

### Payment verification failing?
- Verify payment ID is correct
- Check payment status in Moyassar dashboard
- Ensure subscription ID matches

---

## 📚 Resources

- Moyassar Documentation: https://docs.moyasar.com/
- Moyassar Dashboard: https://dashboard.moyasar.com/
- API Reference: https://docs.moyasar.com/api/

---

**Integration Status: ✅ Complete and Ready for Testing**

