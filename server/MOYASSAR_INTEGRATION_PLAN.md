# Moyassar Payment Gateway Integration Plan

## Overview
This document outlines the step-by-step plan to integrate Moyassar payment gateway into the Talaam Project subscription system.

---

## Prerequisites & Information Required

### 1. Moyassar Account Credentials
You need to provide the following from your Moyassar account dashboard:

- **Publishable Key** (Public Key)
  - Used on the frontend/client-side
  - Found in: Moyassar Dashboard → Settings → API Keys
  
- **Secret Key** (Private Key)
  - Used on the backend/server-side
  - Found in: Moyassar Dashboard → Settings → API Keys
  - ⚠️ **Keep this secret and never expose it to the frontend**

- **Webhook Secret** (if available)
  - Used to verify webhook requests from Moyassar
  - Found in: Moyassar Dashboard → Settings → Webhooks

### 2. Environment Configuration
- **Environment Mode**: Sandbox (Testing) or Production (Live)
- **Webhook URL**: The URL where Moyassar will send payment status updates
  - Example: `https://yourdomain.com/api/payment/moyassar/webhook`
  - For local testing: Use a service like ngrok to expose your local server

### 3. Moyassar API Documentation
- Base API URL: `https://api.moyasar.com/v1/` (verify this in Moyassar docs)
- Payment creation endpoint
- Payment status check endpoint
- Webhook event types and payload structure

---

## Integration Steps

### Phase 1: Setup & Configuration

#### Step 1.1: Install Required Dependencies
```bash
npm install axios
# or if Moyassar has an official SDK:
# npm install @moyasar/sdk
```

#### Step 1.2: Environment Variables Setup
Add to `.env` file:
```env
# Moyassar Payment Gateway Configuration
MOYASSAR_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
MOYASSAR_SECRET_KEY=sk_test_xxxxxxxxxxxxx
MOYASSAR_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
MOYASSAR_API_URL=https://api.moyasar.com/v1
MOYASSAR_ENVIRONMENT=sandbox  # or 'production'

# Webhook Configuration
MOYASSAR_WEBHOOK_URL=https://yourdomain.com/api/payment/moyassar/webhook
```

#### Step 1.3: Create Moyassar Configuration File
- Location: `config/moyassar/moyassar.config.js`
- Purpose: Centralized configuration for Moyassar API

---

### Phase 2: Backend Implementation

#### Step 2.1: Create Moyassar Service
- Location: `services/payment/moyassar.service.js`
- Functions needed:
  - `initiatePayment(subscriptionId, amount, description, metadata)`
    - Creates a payment request in Moyassar
    - Returns payment URL or payment ID
  - `verifyPayment(paymentId)`
    - Checks payment status from Moyassar API
    - Returns payment details
  - `handleWebhook(webhookPayload, signature)`
    - Processes webhook events from Moyassar
    - Updates subscription status based on payment result

#### Step 2.2: Update Subscription Model
- Add new fields to `Subscription.model.js`:
  - `paymentMethod`: String (e.g., 'moyassar', 'manual')
  - `moyassarPaymentId`: String (Moyassar payment ID)
  - `moyassarPaymentStatus`: String (e.g., 'initiated', 'paid', 'failed')
  - `paymentUrl`: String (URL for user to complete payment)

#### Step 2.3: Create Payment Controller
- Location: `controllers/payment/payment.controller.js`
- Endpoints:
  - `POST /api/payment/moyassar/initiate`
    - Initiates payment with Moyassar
    - Returns payment URL to frontend
  - `POST /api/payment/moyassar/verify/:paymentId`
    - Verifies payment status
    - Updates subscription if payment successful
  - `POST /api/payment/moyassar/webhook`
    - Receives webhook from Moyassar
    - Updates subscription status automatically

#### Step 2.4: Create Payment Routes
- Location: `routes/payment/payment.routes.js`
- Routes:
  - `/api/payment/moyassar/initiate` (protected, requires auth)
  - `/api/payment/moyassar/verify/:paymentId` (protected, requires auth)
  - `/api/payment/moyassar/webhook` (public, but signature verified)

#### Step 2.5: Update Subscription Service
- Modify `services/subscription/subscription.service.js`:
  - Update `subscribeToPlan()` to support payment method selection
  - Update `confirmPayment()` to work with Moyassar payment IDs
  - Add `processMoyassarPayment()` function

#### Step 2.6: Create Payment Middleware
- Location: `middlewares/payment/payment.middleware.js`
- Functions:
  - `verifyMoyassarWebhook()`: Verifies webhook signature
  - `validatePaymentRequest()`: Validates payment initiation requests

---

### Phase 3: Integration Flow

#### Step 3.1: Payment Initiation Flow
1. User selects a plan and clicks "Subscribe"
2. Frontend calls: `POST /api/subscription/subscribe` with `planId`
3. Backend creates subscription with `paymentStatus: 'Pending'`
4. Frontend calls: `POST /api/payment/moyassar/initiate` with `subscriptionId`
5. Backend:
   - Creates payment in Moyassar API
   - Stores `moyassarPaymentId` in subscription
   - Returns `paymentUrl` to frontend
6. Frontend redirects user to `paymentUrl` or opens payment form

#### Step 3.2: Payment Completion Flow (Two Methods)

**Method A: Webhook-Based (Recommended)**
1. User completes payment on Moyassar
2. Moyassar sends webhook to: `POST /api/payment/moyassar/webhook`
3. Backend:
   - Verifies webhook signature
   - Updates subscription status automatically
   - Sets `paymentStatus: 'Paid'`, `isActive: true`
4. Frontend polls or receives notification of payment completion

**Method B: Manual Verification**
1. User completes payment on Moyassar
2. User returns to your application
3. Frontend calls: `POST /api/payment/moyassar/verify/:paymentId`
4. Backend:
   - Checks payment status with Moyassar API
   - Updates subscription if payment successful

#### Step 3.3: Error Handling
- Handle payment failures
- Handle expired payment sessions
- Handle webhook retries
- Log all payment events for debugging

---

### Phase 4: Testing

#### Step 4.1: Sandbox Testing
- Test payment initiation
- Test successful payment flow
- Test failed payment flow
- Test webhook delivery
- Test payment verification

#### Step 4.2: Test Cards (Sandbox)
- Get test card numbers from Moyassar documentation
- Test successful payments
- Test declined payments
- Test 3D Secure flow (if applicable)

---

### Phase 5: Security & Best Practices

#### Step 5.1: Security Measures
- ✅ Never expose Secret Key to frontend
- ✅ Verify webhook signatures
- ✅ Use HTTPS for webhook endpoint
- ✅ Validate all payment amounts server-side
- ✅ Implement rate limiting on payment endpoints
- ✅ Log all payment events for audit trail

#### Step 5.2: Error Handling
- Handle network failures
- Handle API rate limits
- Handle invalid payment data
- Provide user-friendly error messages

---

## File Structure (After Integration)

```
server/
├── config/
│   └── moyassar/
│       ├── moyassar.config.js
│       └── index.js
├── controllers/
│   └── payment/
│       ├── payment.controller.js
│       └── index.js
├── middlewares/
│   └── payment/
│       ├── payment.middleware.js
│       └── index.js
├── models/
│   └── subscription/
│       └── Subscription.model.js (updated)
├── routes/
│   └── payment/
│       ├── payment.routes.js
│       └── index.js
└── services/
    └── payment/
        ├── moyassar.service.js
        └── index.js
```

---

## Required Information Checklist

Before starting implementation, please provide:

- [ ] **Moyassar Publishable Key** (Public Key)
- [ ] **Moyassar Secret Key** (Private Key)
- [ ] **Moyassar Webhook Secret** (if available)
- [ ] **Moyassar API Base URL** (verify from documentation)
- [ ] **Environment**: Sandbox or Production?
- [ ] **Webhook URL**: Where should Moyassar send webhooks?
- [ ] **Moyassar API Documentation URL**: For reference
- [ ] **Payment Currency**: SAR, USD, etc.?
- [ ] **Test Card Numbers**: For sandbox testing
- [ ] **Preferred Integration Method**: 
  - [ ] Embedded Payment Form
  - [ ] Redirect to Moyassar
  - [ ] Custom Payment Form with API

---

## Next Steps

Once you provide the required information above, I will:

1. ✅ Create all necessary configuration files
2. ✅ Implement Moyassar service with API integration
3. ✅ Update subscription model with payment fields
4. ✅ Create payment controllers and routes
5. ✅ Implement webhook handling
6. ✅ Update subscription service to work with Moyassar
7. ✅ Add proper error handling and validation
8. ✅ Create comprehensive documentation

---

## Questions to Clarify

1. **Payment Flow Preference**: 
   - Do you want users to be redirected to Moyassar's payment page?
   - Or do you want to embed the payment form in your application?

2. **Webhook vs Polling**:
   - Do you prefer automatic webhook updates (recommended)?
   - Or manual payment verification after user returns?

3. **Payment Amount**:
   - Should the amount be in SAR (Saudi Riyal)?
   - Or do you need multi-currency support?

4. **Error Handling**:
   - How should we handle failed payments?
   - Should we allow retry attempts?

5. **Subscription Renewal**:
   - Will you handle subscription renewals automatically?
   - Or will users need to manually renew?

---

## Estimated Implementation Time

- **Phase 1 (Setup)**: 30 minutes
- **Phase 2 (Backend)**: 2-3 hours
- **Phase 3 (Integration)**: 1-2 hours
- **Phase 4 (Testing)**: 1-2 hours
- **Total**: ~5-8 hours

---

## Support & Resources

- Moyassar Official Documentation: https://docs.moyasar.com/
- Moyassar Dashboard: https://dashboard.moyasar.com/
- For API support, contact Moyassar support team

---

**Ready to proceed?** Please provide the required information from the checklist above, and I'll start implementing the integration! 🚀

