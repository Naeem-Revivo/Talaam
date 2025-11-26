# Complete User Flow: Subscription & Payment Process

## 📋 Overview
This document explains the complete user journey from visiting the site to completing a subscription payment using Moyassar.

---

## 🎯 Complete User Journey

### **STEP 1: User Visits the Website** 
**User Action:** Opens the Talaam website/app

**Frontend Action:**
- Display homepage or pricing page
- Show available subscription plans

**API Call (Optional - to fetch plans):**
```
GET /api/admin/plans
Headers: None (or with token if user is logged in)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "plans": [
      {
        "id": "plan123",
        "name": "Premium Plan",
        "price": 99.99,
        "duration": "Monthly",
        "description": "Access to all premium features",
        "status": "active"
      }
    ]
  }
}
```

**Frontend Display:**
- Show all active plans with prices
- Display "Subscribe" button for each plan

---

### **STEP 2: User Clicks "Subscribe" Button**
**User Action:** Clicks "Subscribe" on a plan (e.g., Premium Plan)

**Frontend Action:**
- Check if user is logged in (check for auth token in localStorage/session)

**Scenario A: User is NOT Logged In** ⬇️
**Scenario B: User IS Logged In** ⬇️

---

## 🔐 SCENARIO A: User is NOT Logged In

### **STEP 2A.1: Redirect to Login**
**Frontend Action:**
- Show login modal/page
- Store the selected `planId` for later use
- Display login form

**User Options:**
1. **Login with Email/Password**
2. **Sign Up (New User)**
3. **Login with Google**

---

### **STEP 2A.2: User Chooses to Login**

#### **Option 1: Login with Email/Password**

**User Action:** Enters email and password, clicks "Login"

**Frontend Action:**
```
POST /api/auth/login
Headers: { "Content-Type": "application/json" }
Body: {
  "email": "user@example.com",
  "password": "password123"
}
```

**Backend Process:**
1. Validates email and password
2. Checks if account is suspended
3. Generates JWT token
4. Returns user data and token

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user123",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "student",
      "isEmailVerified": true
    }
  }
}
```

**Frontend Action:**
- Save token to localStorage/sessionStorage
- Store user data
- **Continue to STEP 3: Create Subscription**

---

#### **Option 2: Sign Up (New User)**

**User Action:** Clicks "Sign Up", fills form, clicks "Create Account"

**Frontend Action:**
```
POST /api/auth/signup
Headers: { "Content-Type": "application/json" }
Body: {
  "email": "newuser@example.com",
  "password": "password123",
  "role": "student"
}
```

**Backend Process:**
1. Checks if email already exists
2. Hashes password
3. Generates OTP (One-Time Password)
4. Creates user account
5. Sends OTP email
6. Generates JWT token

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully. OTP sent to your email (optional verification).",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user456",
      "email": "newuser@example.com",
      "role": "student",
      "isEmailVerified": false
    }
  }
}
```

**Frontend Action:**
- Save token
- Show OTP verification screen (optional - user can skip or verify later)
- **Continue to STEP 3: Create Subscription**

**Note:** OTP verification is optional. User can proceed with subscription even if email is not verified.

---

#### **Option 3: Login with Google**

**User Action:** Clicks "Login with Google"

**Frontend Action:**
1. First, get Google OAuth URL:
```
GET /api/auth/google/url
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://accounts.google.com/o/oauth2/v2/auth?..."
  }
}
```

2. Redirect user to Google OAuth URL
3. User authorizes on Google
4. Google redirects back to:
```
GET /api/auth/google/callback?code=GOOGLE_AUTH_CODE
```

**Backend Process:**
- Exchanges code for Google profile
- Creates or finds user account
- Generates JWT token

**Response:**
```json
{
  "success": true,
  "message": "Google login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user789",
      "name": "John Doe",
      "email": "john@gmail.com",
      "isEmailVerified": true
    }
  }
}
```

**Frontend Action:**
- Save token
- **Continue to STEP 3: Create Subscription**

---

## ✅ SCENARIO B: User IS Logged In

**Frontend Action:**
- User already has token
- **Skip login, go directly to STEP 3**

---

## 📝 STEP 3: Create Subscription

**User Action:** User is now logged in (from Scenario A or B)

**Frontend Action:**
- Retrieve the stored `planId` (from STEP 2)
- Call subscription API

**API Call:**
```
POST /api/subscription/subscribe
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
Body: {
  "planId": "plan123"
}
```

**Backend Process:**
1. Validates JWT token (authMiddleware)
2. Extracts `userId` from token
3. Fetches plan details
4. Checks if plan is active
5. Fetches user details
6. Calculates subscription dates:
   - `startDate`: Current date
   - `expiryDate`: startDate + plan duration (30/90/180/365 days)
7. Creates subscription record with:
   - `paymentStatus: "Pending"`
   - `isActive: false`
   - `paymentMethod: "manual"` (default)

**Response (Success):**
```json
{
  "success": true,
  "message": "Subscription created successfully",
  "data": {
    "subscription": {
      "id": "sub123",
      "userId": "user123",
      "userName": "John Doe",
      "planId": "plan123",
      "planName": "Premium Plan",
      "startDate": "2024-01-15T10:00:00.000Z",
      "expiryDate": "2024-02-14T10:00:00.000Z",
      "paymentStatus": "Pending",
      "isActive": false,
      "transactionId": null,
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  }
}
```

**Frontend Action:**
- Store `subscriptionId` (sub123)
- Show "Proceed to Payment" button
- Display subscription summary

---

## 💳 STEP 4: Initiate Payment with Moyassar

**User Action:** Clicks "Proceed to Payment" or "Pay Now"

**Frontend Action:**
- Call Moyassar payment initiation API

**API Call:**
```
POST /api/payment/moyassar/initiate
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
Body: {
  "subscriptionId": "sub123"
}
```

**Backend Process:**
1. Validates JWT token
2. Verifies subscription belongs to user
3. Fetches subscription and plan details
4. Calls Moyassar API to create payment:
   - Converts price from SAR to halalas (99.99 SAR = 9999 halalas)
   - Creates payment request with:
     - Amount: 9999 halalas
     - Currency: SAR
     - Description: "Subscription: Premium Plan"
     - Metadata: user_id, plan_id, plan_name
     - Callback URL: webhook URL
5. Updates subscription:
   - `paymentMethod: "moyassar"`
   - `moyassarPaymentId: "moyassar_payment_id_123"`
   - `moyassarPaymentStatus: "initiated"`
   - `paymentUrl: "https://moyassar.com/payment/..."`

**Response (Success):**
```json
{
  "success": true,
  "message": "Payment initiated successfully",
  "data": {
    "paymentId": "moyassar_payment_id_123",
    "paymentUrl": "https://moyassar.com/payment/abc123xyz",
    "subscription": {
      "id": "sub123",
      "paymentStatus": "Pending",
      "moyassarPaymentStatus": "initiated"
    }
  }
}
```

**Frontend Action:**
- Store `paymentId` and `paymentUrl`
- Show payment options:
  - **Option A:** Redirect user to `paymentUrl` (Moyassar payment page)
  - **Option B:** Embed Moyassar payment form in your page

---

## 💰 STEP 5: User Completes Payment

### **Option A: Redirect to Moyassar Payment Page** (Recommended)

**User Action:**
- Frontend redirects: `window.location.href = paymentUrl`
- User is taken to Moyassar payment page
- User enters card details:
  - Card number
  - Expiry date
  - CVV
  - Cardholder name
- User clicks "Pay"

**Moyassar Process:**
1. Validates card details
2. Processes payment
3. Shows payment result (Success/Failed)

**After Payment:**
- **If Success:** Moyassar redirects user back to your app (callback URL)
- **If Failed:** User can retry or cancel

---

### **Option B: Embedded Payment Form**

**User Action:**
- Payment form is embedded in your page
- User enters card details
- User clicks "Pay"

**Moyassar Process:**
- Same as Option A, but happens on your page

---

## 🔔 STEP 6: Payment Webhook (Automatic Processing)

**When Payment is Successful:**

**Moyassar Action:**
- Sends webhook to your server:
```
POST /api/payment/moyassar/webhook
Headers: {
  "Content-Type": "application/json",
  "x-moyassar-signature": "signature_hash" (if configured)
}
Body: {
  "id": "moyassar_payment_id_123",
  "status": "paid",
  "amount": 9999,
  "currency": "SAR",
  "metadata": {
    "subscription_id": "sub123",
    "user_id": "user123",
    "plan_id": "plan123"
  }
}
```

**Backend Process:**
1. Verifies webhook signature (if configured)
2. Extracts `subscriptionId` from metadata
3. Verifies payment status with Moyassar API
4. Updates subscription:
   - `paymentStatus: "Paid"`
   - `isActive: true`
   - `transactionId: "moyassar_payment_id_123"`
   - `moyassarPaymentStatus: "paid"`

**Response:**
```json
{
  "success": true,
  "message": "Webhook processed successfully"
}
```

**Note:** This happens automatically in the background. User doesn't need to do anything.

---

## ✅ STEP 7: User Returns to App (After Payment)

**User Action:** Returns to your app (from Moyassar redirect or stays on page)

**Frontend Action:**
- Check payment status

**Option 1: Poll for Payment Status**
```
GET /api/payment/moyassar/status/sub123
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": "sub123",
      "paymentStatus": "Paid",
      "isActive": true,
      "moyassarPaymentStatus": "paid",
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

**Option 2: Manual Verification** (If webhook didn't fire)
```
POST /api/payment/moyassar/verify
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
Body: {
  "paymentId": "moyassar_payment_id_123",
  "subscriptionId": "sub123"
}
```

**Backend Process:**
1. Calls Moyassar API to verify payment
2. If payment is "paid", updates subscription
3. Returns updated subscription

**Response:**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "subscription": {
      "id": "sub123",
      "paymentStatus": "Paid",
      "isActive": true,
      "transactionId": "moyassar_payment_id_123"
    }
  }
}
```

---

## 🎉 STEP 8: Subscription Activated

**Frontend Action:**
- Show success message: "Payment successful! Your subscription is now active."
- Display subscription details:
  - Plan name
  - Start date
  - Expiry date
  - Status: Active
- Redirect to dashboard or premium content

**User Can Now:**
- Access premium features
- Use protected routes (verified by `verifySubscription` middleware)
- View subscription details anytime:
```
GET /api/subscription/me
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 📊 Complete Flow Diagram

```
User Visits Site
    ↓
Browse Plans (GET /api/admin/plans)
    ↓
Click "Subscribe"
    ↓
┌─────────────────────────┐
│ Is User Logged In?      │
└─────────────────────────┘
    ↓                    ↓
   NO                   YES
    ↓                    ↓
Show Login          ─────┘
    ↓
Login/Signup
    ↓
POST /api/auth/login or /signup
    ↓
Get Token
    ↓
POST /api/subscription/subscribe
    ↓
Subscription Created (Pending)
    ↓
POST /api/payment/moyassar/initiate
    ↓
Get Payment URL
    ↓
Redirect to Moyassar
    ↓
User Enters Card Details
    ↓
Payment Processed
    ↓
┌─────────────────────────┐
│ Payment Result          │
└─────────────────────────┘
    ↓                    ↓
  SUCCESS              FAILED
    ↓                    ↓
Webhook Received    Show Error
    ↓                    ↓
Subscription        Retry Payment
  Activated
    ↓
Access Premium Features
```

---

## 🔄 Alternative Flow: Manual Payment Confirmation

If webhook is not configured or fails, user can manually confirm:

1. User completes payment on Moyassar
2. User returns to app
3. Frontend calls:
```
POST /api/payment/moyassar/verify
Body: {
  "paymentId": "...",
  "subscriptionId": "..."
}
```
4. Backend verifies and activates subscription
5. User gets access

---

## ⚠️ Error Handling

### Payment Failed
- Show error message
- Allow user to retry payment
- Subscription remains in "Pending" status

### Payment Cancelled
- User can cancel payment on Moyassar
- Subscription remains in "Pending" status
- User can initiate payment again

### Network Error
- Show retry option
- Store subscription ID for later retry

---

## 📝 Summary of All API Endpoints Used

1. **GET /api/admin/plans** - View available plans
2. **POST /api/auth/login** - Login
3. **POST /api/auth/signup** - Sign up
4. **GET /api/auth/google/url** - Get Google OAuth URL
5. **GET /api/auth/google/callback** - Google OAuth callback
6. **POST /api/subscription/subscribe** - Create subscription
7. **POST /api/payment/moyassar/initiate** - Start payment
8. **POST /api/payment/moyassar/verify** - Verify payment (manual)
9. **GET /api/payment/moyassar/status/:subscriptionId** - Check payment status
10. **POST /api/payment/moyassar/webhook** - Receive webhook (automatic)
11. **GET /api/subscription/me** - View my subscription

---

## 🎯 Key Points

1. **Authentication is Required** - All subscription/payment endpoints need JWT token
2. **Subscription Created First** - Subscription is created with "Pending" status before payment
3. **Payment Initiated Separately** - Payment is initiated after subscription creation
4. **Webhook is Automatic** - Payment confirmation happens automatically via webhook
5. **Manual Verification Available** - Can manually verify if webhook fails
6. **Subscription Activated on Payment** - Only becomes active after successful payment

---

**This completes the entire user flow from visiting the site to having an active subscription!** 🎉

