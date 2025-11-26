# Postman Setup Guide for Moyassar Payment API

## ✅ Complete Request Setup

### 1. Request Method & URL
- **Method:** `POST`
- **URL:** `{{base_url}}/api/payment/moyassar/initiate`
  - Replace `{{base_url}}` with your server URL (e.g., `http://localhost:5000` or your production URL)

### 2. Headers Tab (IMPORTANT!)

You **MUST** include the Authorization header:

| Key | Value |
|-----|-------|
| `Authorization` | `Bearer YOUR_JWT_TOKEN_HERE` |
| `Content-Type` | `application/json` |

**How to get the token:**
1. First, login using the login endpoint:
   ```
   POST {{base_url}}/api/auth/login
   Body: {
     "email": "your@email.com",
     "password": "yourpassword"
   }
   ```
2. Copy the `token` from the response
3. Use it in the Authorization header: `Bearer <paste_token_here>`

### 3. Body Tab

**Select:** `raw` → `JSON`

**Body Content:**
```json
{
  "subscriptionId": "6926e257548a832b8cc8b239"
}
```

---

## 📋 Complete Step-by-Step Testing

### Step 1: Login to Get Token

**Request:**
```
POST {{base_url}}/api/auth/login
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... }
  }
}
```

**Action:** Copy the `token` value

---

### Step 2: Create Subscription (If not already created)

**Request:**
```
POST {{base_url}}/api/subscription/subscribe
```

**Headers:**
```
Authorization: Bearer <token_from_step_1>
Content-Type: application/json
```

**Body:**
```json
{
  "planId": "your_plan_id_here"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": "6926e257548a832b8cc8b239",
      ...
    }
  }
}
```

**Action:** Copy the subscription `id`

---

### Step 3: Initiate Payment (Your Current Request)

**Request:**
```
POST {{base_url}}/api/payment/moyassar/initiate
```

**Headers:**
```
Authorization: Bearer <token_from_step_1>
Content-Type: application/json
```

**Body:**
```json
{
  "subscriptionId": "6926e257548a832b8cc8b239"
}
```

**Expected Success Response:**
```json
{
  "success": true,
  "message": "Payment initiated successfully",
  "data": {
    "paymentId": "moyassar_payment_id_123",
    "paymentUrl": "https://moyassar.com/payment/...",
    "subscription": {
      "id": "6926e257548a832b8cc8b239",
      "paymentStatus": "Pending",
      "moyassarPaymentStatus": "initiated"
    }
  }
}
```

---

## ⚠️ Common Issues

### Issue 1: "Unauthorized" or "Invalid token"

**Cause:** Missing or invalid Authorization header

**Solution:**
1. Make sure you have the `Authorization` header
2. Format: `Bearer <token>` (with space after "Bearer")
3. Token must be from a recent login (tokens expire)

---

### Issue 2: "Subscription not found"

**Cause:** 
- Subscription ID is wrong
- Subscription belongs to a different user
- Subscription doesn't exist

**Solution:**
1. Verify subscription ID is correct
2. Make sure you're logged in as the user who created the subscription
3. Check subscription exists: `GET /api/subscription/me`

---

### Issue 3: "Invalid authorization credentials" (Moyassar error)

**Cause:** Moyassar API credentials issue

**Solution:**
1. Check server logs for detailed error
2. Run: `node scripts/testMoyassarAPI.js`
3. Verify `.env` file has correct `MOYASSAR_SECRET_KEY`
4. Restart server after updating `.env`

---

## 🔧 Postman Environment Variables

Set up environment variables in Postman:

1. Create a new Environment
2. Add variables:
   - `base_url`: `http://localhost:5000` (or your server URL)
   - `auth_token`: (will be set after login)

3. Use in requests:
   - URL: `{{base_url}}/api/payment/moyassar/initiate`
   - Header: `Bearer {{auth_token}}`

4. Auto-set token after login:
   - In login request, go to "Tests" tab
   - Add script:
   ```javascript
   if (pm.response.code === 200) {
     const jsonData = pm.response.json();
     pm.environment.set("auth_token", jsonData.data.token);
   }
   ```

---

## ✅ Quick Checklist

Before sending the payment initiation request:

- [ ] You have a valid JWT token (from login)
- [ ] Authorization header is set: `Bearer <token>`
- [ ] Content-Type header is set: `application/json`
- [ ] Body is in JSON format
- [ ] `subscriptionId` is correct and exists
- [ ] Subscription belongs to the logged-in user
- [ ] Subscription status is "Pending" (not already paid)
- [ ] Server is running
- [ ] Moyassar credentials are configured in `.env`

---

## 🧪 Test Script for Postman

Add this to the "Tests" tab of your payment initiation request:

```javascript
// Check if request was successful
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has payment URL", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.data.paymentUrl).to.exist;
    
    // Save payment URL for later use
    pm.environment.set("payment_url", jsonData.data.paymentUrl);
    pm.environment.set("payment_id", jsonData.data.paymentId);
});
```

---

**Your request body is correct! Just make sure you have the Authorization header with a valid token.** 🔑

