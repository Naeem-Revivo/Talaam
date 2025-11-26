# API Reference - Complete List with Request Bodies

## 🔐 Authentication APIs

### 1. Login
**Endpoint:** `POST /api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
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

---

### 2. Sign Up
**Endpoint:** `POST /api/auth/signup`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "role": "student"
}
```

**Success Response (201):**
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

---

### 3. Get Google OAuth URL
**Endpoint:** `GET /api/auth/google/url`

**Headers:** None

**Request Body:** None

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "url": "https://accounts.google.com/o/oauth2/v2/auth?..."
  }
}
```

---

### 4. Google OAuth Callback
**Endpoint:** `GET /api/auth/google/callback?code=GOOGLE_AUTH_CODE`

**Headers:** None

**Request Body:** None (code in query parameter)

**Success Response (200):**
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

---

## 📋 Plan APIs

### 5. Get All Plans
**Endpoint:** `GET /api/admin/plans`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** None

**Query Parameters (Optional - Superadmin only):**
```
?status=active
```

**Success Response (200):**
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
        "status": "active",
        "createdAt": "2024-01-15T10:00:00.000Z",
        "updatedAt": "2024-01-15T10:00:00.000Z"
      }
    ]
  }
}
```

---

### 6. Get Plan by ID
**Endpoint:** `GET /api/admin/plans/:planId`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** None

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "plan": {
      "id": "plan123",
      "name": "Premium Plan",
      "price": 99.99,
      "duration": "Monthly",
      "description": "Access to all premium features",
      "status": "active"
    }
  }
}
```

---

## 📝 Subscription APIs

### 7. Subscribe to Plan
**Endpoint:** `POST /api/subscription/subscribe`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "planId": "plan123"
}
```

**Success Response (201):**
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
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  }
}
```

---

### 8. Get My Subscription
**Endpoint:** `GET /api/subscription/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** None

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": "sub123",
      "userId": "user123",
      "userName": "John Doe",
      "planId": {
        "_id": "plan123",
        "name": "Premium Plan",
        "price": 99.99,
        "duration": "Monthly",
        "description": "Access to all premium features",
        "status": "active"
      },
      "planName": "Premium Plan",
      "startDate": "2024-01-15T10:00:00.000Z",
      "expiryDate": "2024-02-14T10:00:00.000Z",
      "paymentStatus": "Paid",
      "isActive": true,
      "transactionId": "moyassar_payment_id_123",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:05:00.000Z"
    }
  }
}
```

---

### 9. Confirm Payment (Manual - Legacy)
**Endpoint:** `POST /api/subscription/payment/confirm`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "subscriptionId": "sub123",
  "transactionId": "TXN123456789"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Payment confirmed successfully",
  "data": {
    "subscription": {
      "id": "sub123",
      "userId": "user123",
      "userName": "John Doe",
      "planId": "plan123",
      "planName": "Premium Plan",
      "startDate": "2024-01-15T10:00:00.000Z",
      "expiryDate": "2024-02-14T10:00:00.000Z",
      "paymentStatus": "Paid",
      "isActive": true,
      "transactionId": "TXN123456789",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:05:00.000Z"
    }
  }
}
```

---

## 💳 Moyassar Payment APIs

### 10. Initiate Payment
**Endpoint:** `POST /api/payment/moyassar/initiate`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "subscriptionId": "sub123"
}
```

**Success Response (200):**
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

---

### 11. Verify Payment
**Endpoint:** `POST /api/payment/moyassar/verify`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "paymentId": "moyassar_payment_id_123",
  "subscriptionId": "sub123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "subscription": {
      "id": "sub123",
      "paymentStatus": "Paid",
      "isActive": true,
      "transactionId": "moyassar_payment_id_123",
      "moyassarPaymentStatus": "paid"
    }
  }
}
```

**Error Response (400) - Payment Failed:**
```json
{
  "success": false,
  "message": "Payment failed",
  "data": {
    "subscription": {
      "id": "sub123",
      "paymentStatus": "Pending",
      "moyassarPaymentStatus": "failed"
    }
  }
}
```

---

### 12. Get Payment Status
**Endpoint:** `GET /api/payment/moyassar/status/:subscriptionId`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** None

**URL Parameter:**
- `subscriptionId` - The subscription ID

**Example:** `GET /api/payment/moyassar/status/sub123`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": "sub123",
      "paymentStatus": "Paid",
      "isActive": true,
      "moyassarPaymentStatus": "paid",
      "paymentUrl": "https://moyassar.com/payment/abc123xyz",
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

### 13. Webhook Endpoint (Public)
**Endpoint:** `POST /api/payment/moyassar/webhook`

**Headers:**
```
Content-Type: application/json
x-moyassar-signature: signature_hash (optional)
```

**Request Body (from Moyassar):**
```json
{
  "id": "moyassar_payment_id_123",
  "status": "paid",
  "amount": 9999,
  "currency": "SAR",
  "metadata": {
    "subscription_id": "sub123",
    "user_id": "user123",
    "plan_id": "plan123",
    "plan_name": "Premium Plan"
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Webhook processed successfully",
  "data": {
    "success": true,
    "subscription": { ... },
    "message": "Payment processed successfully"
  }
}
```

**Note:** This endpoint is public (no auth required) but signature-verified.

---

## 📊 Complete API Flow Summary

### Typical Subscription Flow:

1. **Get Plans** (Optional)
   ```
   GET /api/admin/plans
   Authorization: Bearer <token>
   ```

2. **Login** (If not logged in)
   ```
   POST /api/auth/login
   Body: { "email": "...", "password": "..." }
   ```

3. **Create Subscription**
   ```
   POST /api/subscription/subscribe
   Authorization: Bearer <token>
   Body: { "planId": "plan123" }
   ```

4. **Initiate Payment**
   ```
   POST /api/payment/moyassar/initiate
   Authorization: Bearer <token>
   Body: { "subscriptionId": "sub123" }
   ```

5. **Check Payment Status** (After user returns from payment)
   ```
   GET /api/payment/moyassar/status/sub123
   Authorization: Bearer <token>
   ```

6. **Or Verify Payment Manually** (If webhook didn't fire)
   ```
   POST /api/payment/moyassar/verify
   Authorization: Bearer <token>
   Body: {
     "paymentId": "moyassar_payment_id_123",
     "subscriptionId": "sub123"
   }
   ```

7. **Get My Subscription** (To view subscription details)
   ```
   GET /api/subscription/me
   Authorization: Bearer <token>
   ```

---

## 🔑 Authentication Header Format

All protected endpoints require:
```
Authorization: Bearer <your_jwt_token>
```

**Example:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXIxMjMiLCJpYXQiOjE2MDE1MjM0NTZ9.xyz123
```

---

## ⚠️ Common Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized. Please provide a valid token."
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "Plan ID is required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Subscription not found"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Please subscribe to access this feature."
}
```

---

## 📝 Notes

1. **All dates are in ISO 8601 format** (e.g., `2024-01-15T10:00:00.000Z`)
2. **All IDs are MongoDB ObjectIds** (24 character hex strings)
3. **Token expires** - Check token expiry and refresh if needed
4. **Payment amounts** - Moyassar uses halalas (1 SAR = 100 halalas), but API accepts SAR
5. **Webhook is automatic** - No need to call it manually, Moyassar sends it

---

## 🧪 Testing

### Test with cURL:

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Subscribe:**
```bash
curl -X POST http://localhost:5000/api/subscription/subscribe \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"planId":"plan123"}'
```

**Initiate Payment:**
```bash
curl -X POST http://localhost:5000/api/payment/moyassar/initiate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"subscriptionId":"sub123"}'
```

---

**All APIs are ready to use!** 🚀

