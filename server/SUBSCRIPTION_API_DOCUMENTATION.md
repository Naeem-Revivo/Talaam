# Subscription & Plan Management API Documentation

## Table of Contents
1. [Plan Management (Superadmin)](#plan-management-superadmin)
2. [Subscription Flow (Users)](#subscription-flow-users)
3. [Protected Routes](#protected-routes)

---

## Plan Management (Superadmin)

### 1. Create Plan
**Only Superadmin can create plans**

**Endpoint:** `POST /api/admin/plans`

**Headers:**
```
Authorization: Bearer <superadmin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Premium Plan",
  "price": 99.99,
  "duration": "Monthly",
  "description": "Access to all premium features",
  "status": "active"
}
```

**Field Validations:**
- `name` (string, required): Plan name
- `price` (number, required): Plan price (must be >= 0)
- `duration` (string, required): One of: `"Monthly"`, `"Quarterly"`, `"Semi-Annual"`, `"Annual"`
- `description` (string, optional): Plan description
- `status` (string, required): One of: `"active"`, `"inactive"`

**Success Response (201):**
```json
{
  "success": true,
  "message": "Plan created successfully",
  "data": {
    "plan": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Premium Plan",
      "price": 99.99,
      "duration": "Monthly",
      "description": "Access to all premium features",
      "status": "active",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  }
}
```

**Error Response (400 - Validation Error):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "price",
      "message": "Price must be a positive number"
    }
  ]
}
```

**Error Response (403 - Access Denied):**
```json
{
  "success": false,
  "message": "Access denied. Only superadmin can create plans"
}
```

---

### 2. Get All Plans
**All authenticated users can view plans (students/admins see only active plans)**

**Endpoint:** `GET /api/admin/plans`

**Query Parameters (Superadmin only):**
- `status` (optional): Filter by status (`"active"` or `"inactive"`)

**Headers:**
```
Authorization: Bearer <token>
```

**Example Request:**
```
GET /api/admin/plans
GET /api/admin/plans?status=active  (Superadmin only)
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "plans": [
      {
        "id": "507f1f77bcf86cd799439011",
        "name": "Premium Plan",
        "price": 99.99,
        "duration": "Monthly",
        "description": "Access to all premium features",
        "status": "active",
        "createdAt": "2024-01-15T10:00:00.000Z",
        "updatedAt": "2024-01-15T10:00:00.000Z"
      },
      {
        "id": "507f1f77bcf86cd799439012",
        "name": "Basic Plan",
        "price": 49.99,
        "duration": "Quarterly",
        "description": "Basic features access",
        "status": "active",
        "createdAt": "2024-01-10T10:00:00.000Z",
        "updatedAt": "2024-01-10T10:00:00.000Z"
      }
    ]
  }
}
```

---

### 3. Get Plan by ID
**All authenticated users can view a specific plan**

**Endpoint:** `GET /api/admin/plans/:planId`

**Headers:**
```
Authorization: Bearer <token>
```

**Example Request:**
```
GET /api/admin/plans/507f1f77bcf86cd799439011
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "plan": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Premium Plan",
      "price": 99.99,
      "duration": "Monthly",
      "description": "Access to all premium features",
      "status": "active",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Plan not found"
}
```

---

### 4. Update Plan
**Only Superadmin can update plans**

**Endpoint:** `PUT /api/admin/plans/:planId`

**Headers:**
```
Authorization: Bearer <superadmin_token>
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "name": "Premium Plan Updated",
  "price": 129.99,
  "duration": "Quarterly",
  "description": "Updated description",
  "status": "active"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Plan updated successfully",
  "data": {
    "plan": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Premium Plan Updated",
      "price": 129.99,
      "duration": "Quarterly",
      "description": "Updated description",
      "status": "active",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T11:30:00.000Z"
    }
  }
}
```

---

### 5. Update Plan Status
**Only Superadmin can update plan status**

**Endpoint:** `PUT /api/admin/plans/:planId/status`

**Headers:**
```
Authorization: Bearer <superadmin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "inactive"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Plan status updated successfully",
  "data": {
    "plan": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Premium Plan",
      "status": "inactive",
      "updatedAt": "2024-01-15T11:30:00.000Z"
    }
  }
}
```

---

### 6. Delete Plan
**Only Superadmin can delete plans**

**Endpoint:** `DELETE /api/admin/plans/:planId`

**Headers:**
```
Authorization: Bearer <superadmin_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Plan deleted successfully",
  "data": {
    "plan": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Premium Plan"
    }
  }
}
```

---

## Subscription Flow (Users)

### 1. Subscribe to a Plan
**Create a subscription with pending payment status**

**Endpoint:** `POST /api/subscription/subscribe`

**Headers:**
```
Authorization: Bearer <user_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "planId": "507f1f77bcf86cd799439011"
}
```

**Field Validations:**
- `planId` (string, required): Valid MongoDB ObjectId of an active plan

**Success Response (201):**
```json
{
  "success": true,
  "message": "Subscription created successfully",
  "data": {
    "subscription": {
      "id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439013",
      "userName": "John Doe",
      "planId": "507f1f77bcf86cd799439011",
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

**Error Response (400 - Plan ID Missing):**
```json
{
  "success": false,
  "message": "Plan ID is required"
}
```

**Error Response (404 - Plan Not Found):**
```json
{
  "success": false,
  "message": "Plan not found"
}
```

**Error Response (400 - Plan Not Active):**
```json
{
  "success": false,
  "message": "This plan is not available for subscription"
}
```

**Duration Conversion:**
- `"Monthly"` → 30 days
- `"Quarterly"` → 90 days
- `"Semi-Annual"` → 180 days
- `"Annual"` → 365 days

---

### 2. Confirm Payment
**Activate subscription after payment confirmation**

**Endpoint:** `POST /api/subscription/payment/confirm`

**Headers:**
```
Authorization: Bearer <user_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "subscriptionId": "507f1f77bcf86cd799439012",
  "transactionId": "TXN123456789"
}
```

**Field Validations:**
- `subscriptionId` (string, required): Valid MongoDB ObjectId of the subscription
- `transactionId` (string, required): Payment transaction ID from payment gateway

**Success Response (200):**
```json
{
  "success": true,
  "message": "Payment confirmed successfully",
  "data": {
    "subscription": {
      "id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439013",
      "userName": "John Doe",
      "planId": "507f1f77bcf86cd799439011",
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

**Error Response (400 - Missing Fields):**
```json
{
  "success": false,
  "message": "Subscription ID is required"
}
```

```json
{
  "success": false,
  "message": "Transaction ID is required"
}
```

**Error Response (404 - Subscription Not Found):**
```json
{
  "success": false,
  "message": "Subscription not found"
}
```

---

### 3. Get My Subscription
**Get the logged-in user's latest subscription**

**Endpoint:** `GET /api/subscription/me`

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
      "userId": "507f1f77bcf86cd799439013",
      "userName": "John Doe",
      "planId": {
        "_id": "507f1f77bcf86cd799439011",
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
      "transactionId": "TXN123456789",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:05:00.000Z"
    }
  }
}
```

**Error Response (404 - No Subscription):**
```json
{
  "success": false,
  "message": "No subscription found"
}
```

---

## Protected Routes

### Using verifySubscription Middleware

To protect any route that requires an active subscription, use the `verifySubscription` middleware.

**Example Protected Route:**
```javascript
const { verifySubscription } = require('../../middlewares/subscription');

router.get('/premium-content', verifySubscription, (req, res) => {
  // User has valid subscription - allow access
  // req.subscription is available here
  res.json({ 
    message: 'Premium content',
    subscriptionExpiry: req.subscription.expiryDate 
  });
});
```

**Example Endpoint:** `GET /api/subscription/exam/:id`

**Headers:**
```
Authorization: Bearer <user_token>
```

**Success Response (200):**
```
Exam data...
```

**Error Response (403 - No Active Subscription):**
```json
{
  "status": 403,
  "success": false,
  "message": "Please subscribe to access this feature."
}
```

**Subscription Validation Rules:**
- `isActive` must be `true`
- `expiryDate` must be greater than or equal to current date
- Subscription must belong to the logged-in user

---

## Complete User Flow Example

### Step 1: Browse Available Plans
```
GET /api/admin/plans
Authorization: Bearer <user_token>
```

### Step 2: Subscribe to a Plan
```
POST /api/subscription/subscribe
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "planId": "507f1f77bcf86cd799439011"
}
```

### Step 3: Complete Payment (via Payment Gateway)
```
[User completes payment through payment gateway]
[Payment gateway returns transactionId]
```

### Step 4: Confirm Payment
```
POST /api/subscription/payment/confirm
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "subscriptionId": "507f1f77bcf86cd799439012",
  "transactionId": "TXN123456789"
}
```

### Step 5: Access Premium Features
```
GET /api/subscription/exam/123
Authorization: Bearer <user_token>
```

---

## Subscription States

| State | paymentStatus | isActive | Can Access? |
|-------|--------------|----------|-------------|
| Created | `Pending` | `false` | ❌ No |
| Payment Confirmed | `Paid` | `true` | ✅ Yes (if not expired) |
| Expired | `Paid` | `true` | ❌ No (expiryDate < now) |
| Cancelled | `Cancelled` | `false` | ❌ No |

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (Validation Error) |
| 401 | Unauthorized (No/Invalid Token) |
| 403 | Forbidden (Access Denied / No Subscription) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Notes

1. **Authentication Required**: All endpoints require `Authorization: Bearer <token>` header
2. **Role-Based Access**: Plan creation/update/deletion requires `superadmin` role
3. **Name Snapshot**: Both `userName` and `planName` are stored as snapshots at subscription creation
4. **Duration Conversion**: Plan duration strings are automatically converted to days
5. **Latest Subscription**: `GET /api/subscription/me` returns the most recent subscription (sorted by creation date)

