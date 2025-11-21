# Question Workflow System - Complete Explanation

## 🔐 Understanding Tokens (JWT Authentication)

### What is a "Workflow Token"?

**There is NO separate "workflow token"** - it's just a **regular JWT (JSON Web Token)** that contains user information including their `adminRole`.

### How Tokens Work:

1. **Token Generation** (During Login/Signup):
   - User logs in with email/password
   - Server generates a JWT token containing: `{ id: userId }`
   - Token expires in 7 days (configurable via `JWT_EXPIRE`)

2. **Token Structure**:
   ```json
   {
     "id": "507f1f77bcf86cd799439011",
     "iat": 1234567890,
     "exp": 1234567890
   }
   ```

3. **Token Usage**:
   - Client sends token in header: `Authorization: Bearer <token>`
   - Server extracts token → verifies it → fetches user from database
   - Server attaches user info to request: `req.user = { id, email, role, adminRole }`

4. **Role-Based Access**:
   - The token itself doesn't contain roles
   - Server looks up user in database to get `role` and `adminRole`
   - Middleware checks if user has required permissions

---

## 👥 User Roles & Permissions

### User Model Structure:
```javascript
{
  role: 'superadmin' | 'admin' | 'student',  // Main role
  adminRole: 'gatherer' | 'creator' | 'explainer' | 'processor' | null,  // Workflow role
  status: 'active' | 'suspended'
}
```

### Role Hierarchy:

1. **Superadmin** (`role: 'superadmin'`):
   - Can create/manage admin users
   - Can manage exams, subjects
   - No `adminRole` needed

2. **Admin with Workflow Role** (`role: 'admin'` + `adminRole`):
   - **Gatherer** (`adminRole: 'gatherer'`): Creates questions
   - **Creator** (`adminRole: 'creator'`): Edits/improves questions
   - **Explainer** (`adminRole: 'explainer'`): Adds explanations
   - **Processor** (`adminRole: 'processor'`): Approves/rejects questions

3. **Student** (`role: 'student'`):
   - Regular users, no admin access

---

## 📋 Complete Question Workflow

### Visual Flow:
```
┌─────────────────────────────────────────────────────────────┐
│                    QUESTION LIFECYCLE                       │
└─────────────────────────────────────────────────────────────┘

1. GATHERER creates question
   ↓
   Status: pending_processor
   
2. PROCESSOR reviews
   ├─→ APPROVE → Status: pending_creator
   └─→ REJECT → Status: rejected (END)
   
3. CREATOR updates question
   ↓
   Status: pending_processor
   
4. PROCESSOR reviews again
   ├─→ APPROVE → Status: pending_explainer
   └─→ REJECT → Status: rejected (END)
   
5. EXPLAINER adds explanation
   ↓
   Status: pending_processor
   
6. PROCESSOR final review
   ├─→ APPROVE → Status: completed (END)
   └─→ REJECT → Status: rejected (END)
```

---

## 🔄 Detailed Workflow Steps

### **Step 1: Gatherer Creates Question**

**Who:** User with `role: 'admin'` and `adminRole: 'gatherer'`

**Endpoint:** `POST /api/admin/questions`

**What Happens:**
1. Gatherer submits question with exam, subject, topic, question text, options, correct answer
2. Question is created with status: `pending_processor`
3. Question is assigned to the Gatherer (`createdBy` field)

**Required Token:**
- Must be logged in as admin with `adminRole: 'gatherer'`
- Token obtained from: `POST /api/auth/login` (with gatherer credentials)

**Example:**
```bash
# 1. Login as Gatherer
curl -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"gatherer@example.com","password":"password123"}'
# Response: { "data": { "token": "eyJhbGc...", "user": {...} } }

# 2. Create Question (use token from step 1)
curl -X POST "http://localhost:5000/api/admin/questions" \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "exam": "507f1f77bcf86cd799439011",
    "subject": "507f1f77bcf86cd799439012",
    "topic": "507f1f77bcf86cd799439013",
    "questionText": "What is 2+2?",
    "questionType": "MCQ",
    "options": {"A": "3", "B": "4", "C": "5", "D": "6"},
    "correctAnswer": "B"
  }'
```

---

### **Step 2: Processor Reviews (First Time)**

**Who:** User with `role: 'admin'` and `adminRole: 'processor'`

**Endpoints:**
- `GET /api/admin/questions/processor` - List pending questions
- `GET /api/admin/questions/processor/:questionId` - View question details
- `POST /api/admin/questions/processor/:questionId/approve` - Approve
- `POST /api/admin/questions/processor/:questionId/reject` - Reject

**What Happens:**
- **If APPROVED:**
  - Status changes to: `pending_creator`
  - Question moves to Creator's queue
  - `approvedBy` field is set
  
- **If REJECTED:**
  - Status changes to: `rejected`
  - `rejectionReason` is stored
  - Workflow ends (question cannot proceed)

**Required Token:**
- Must be logged in as admin with `adminRole: 'processor'`

**Example:**
```bash
# 1. Login as Processor
curl -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"processor@example.com","password":"password123"}'

# 2. Get pending questions
curl -H "Authorization: Bearer <processor_token>" \
  "http://localhost:5000/api/admin/questions/processor?status=pending_processor"

# 3. Approve question
curl -X POST "http://localhost:5000/api/admin/questions/processor/<questionId>/approve" \
  -H "Authorization: Bearer <processor_token>"
```

---

### **Step 3: Creator Updates Question**

**Who:** User with `role: 'admin'` and `adminRole: 'creator'`

**Endpoints:**
- `GET /api/admin/questions/creator` - List questions pending creator review
- `GET /api/admin/questions/creator/:questionId` - View question
- `PUT /api/admin/questions/creator/:questionId` - Update question

**What Happens:**
1. Creator sees questions with status: `pending_creator`
2. Creator can update: question text, options, correct answer, exam, subject, topic
3. After update, status changes to: `pending_processor`
4. Question goes back to Processor for review

**Required Token:**
- Must be logged in as admin with `adminRole: 'creator'`

**Example:**
```bash
# 1. Login as Creator
curl -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"creator@example.com","password":"password123"}'

# 2. Get questions pending creator review
curl -H "Authorization: Bearer <creator_token>" \
  "http://localhost:5000/api/admin/questions/creator?status=pending_creator"

# 3. Update question
curl -X PUT "http://localhost:5000/api/admin/questions/creator/<questionId>" \
  -H "Authorization: Bearer <creator_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "questionText": "What is the result of 2 + 2?",
    "options": {"A": "1", "B": "2", "C": "3", "D": "4"},
    "correctAnswer": "D"
  }'
```

---

### **Step 4: Processor Reviews (Second Time)**

**Who:** User with `role: 'admin'` and `adminRole: 'processor'`

**What Happens:**
- **If APPROVED:**
  - Status changes to: `pending_explainer`
  - Question moves to Explainer's queue
  
- **If REJECTED:**
  - Status changes to: `rejected`
  - Workflow ends

**Same endpoints as Step 2**

---

### **Step 5: Explainer Adds Explanation**

**Who:** User with `role: 'admin'` and `adminRole: 'explainer'`

**Endpoints:**
- `GET /api/admin/questions/explainer` - List questions pending explanation
- `GET /api/admin/questions/explainer/:questionId` - View question
- `PUT /api/admin/questions/explainer/:questionId/explanation` - Add/update explanation

**What Happens:**
1. Explainer sees questions with status: `pending_explainer`
2. Explainer adds detailed explanation
3. After update, status changes to: `pending_processor`
4. Question goes back to Processor for final review

**Required Token:**
- Must be logged in as admin with `adminRole: 'explainer'`

**Example:**
```bash
# 1. Login as Explainer
curl -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"explainer@example.com","password":"password123"}'

# 2. Get questions pending explanation
curl -H "Authorization: Bearer <explainer_token>" \
  "http://localhost:5000/api/admin/questions/explainer?status=pending_explainer"

# 3. Add explanation
curl -X PUT "http://localhost:5000/api/admin/questions/explainer/<questionId>/explanation" \
  -H "Authorization: Bearer <explainer_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "explanation": "The correct answer is 4 because when you add 2 and 2 together, you get 4. This is a fundamental arithmetic operation."
  }'
```

---

### **Step 6: Processor Final Review**

**Who:** User with `role: 'admin'` and `adminRole: 'processor'`

**What Happens:**
- **If APPROVED:**
  - Status changes to: `completed`
  - Question is fully processed and ready for use
  - Workflow ends successfully
  
- **If REJECTED:**
  - Status changes to: `rejected`
  - Workflow ends

**Same endpoints as Step 2**

---

## 🔒 Authentication Flow

### How to Get a Token for Each Role:

1. **Create Admin Users** (Superadmin only):
   ```bash
   # Login as superadmin first
   curl -X POST "http://localhost:5000/api/auth/login" \
     -H "Content-Type: application/json" \
     -d '{"email":"superadmin@example.com","password":"password123"}'
   
   # Create gatherer
   curl -X POST "http://localhost:5000/api/admin/create" \
     -H "Authorization: Bearer <superadmin_token>" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "John Gatherer",
       "email": "gatherer@example.com",
       "password": "password123",
       "adminRole": "gatherer",
       "status": "active"
     }'
   ```

2. **Login as Each Role**:
   ```bash
   # Each workflow role logs in with their credentials
   curl -X POST "http://localhost:5000/api/auth/login" \
     -H "Content-Type: application/json" \
     -d '{"email":"gatherer@example.com","password":"password123"}'
   # Response contains token - use this for all subsequent requests
   ```

3. **Use Token in Requests**:
   ```bash
   # Include token in Authorization header
   curl -H "Authorization: Bearer <your_token_here>" \
     "http://localhost:5000/api/admin/questions"
   ```

---

## 🛡️ Middleware Protection

### Request Flow:
```
1. Request arrives
   ↓
2. authMiddleware checks token
   ├─→ Valid? → Attach user to req.user
   └─→ Invalid? → Return 401 Unauthorized
   ↓
3. Role Middleware checks permissions
   ├─→ gathererMiddleware → Checks adminRole === 'gatherer'
   ├─→ creatorMiddleware → Checks adminRole === 'creator'
   ├─→ explainerMiddleware → Checks adminRole === 'explainer'
   ├─→ processorMiddleware → Checks adminRole === 'processor'
   └─→ workflowRoleMiddleware → Checks adminRole in ['gatherer','creator','explainer','processor']
   ↓
4. Controller processes request
```

### Access Control:
- **Gatherer** can only:
  - Create questions
  - View their own questions
  
- **Creator** can only:
  - View questions with status `pending_creator`
  - Update those questions
  
- **Explainer** can only:
  - View questions with status `pending_explainer`
  - Add/update explanations
  
- **Processor** can only:
  - View questions with status `pending_processor`
  - Approve or reject questions

---

## 📊 Question Status Values

| Status | Meaning | Who Can See It |
|--------|---------|---------------|
| `pending_processor` | Waiting for processor approval | Gatherer (their own), Processor |
| `pending_creator` | Waiting for creator to update | Creator, Processor |
| `pending_explainer` | Waiting for explainer to add explanation | Explainer, Processor |
| `completed` | Fully processed and approved | All roles (for viewing) |
| `rejected` | Rejected by processor | All roles (for viewing) |

---

## 🎯 Key Points to Remember

1. **No Separate "Workflow Token"**: It's just a regular JWT token from login
2. **Token Contains User ID Only**: Server looks up user to get roles
3. **Role = Permission**: Each endpoint checks both `role: 'admin'` AND specific `adminRole`
4. **Status Drives Workflow**: Questions move through statuses based on approvals
5. **Processor is Gatekeeper**: Processor approves/rejects at each stage
6. **One Question, Multiple Reviews**: Question goes through processor 3 times (after gatherer, creator, explainer)

---

## 🧪 Testing the Workflow

### Complete Test Sequence:

```bash
# 1. Setup: Create workflow users (as superadmin)
# ... (create gatherer, creator, explainer, processor)

# 2. Gatherer creates question
TOKEN_GATHERER=$(curl -s -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"gatherer@example.com","password":"pass"}' | jq -r '.data.token')

QUESTION_ID=$(curl -s -X POST "http://localhost:5000/api/admin/questions" \
  -H "Authorization: Bearer $TOKEN_GATHERER" \
  -H "Content-Type: application/json" \
  -d '{...}' | jq -r '.data.question.id')

# 3. Processor approves (first time)
TOKEN_PROCESSOR=$(curl -s -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"processor@example.com","password":"pass"}' | jq -r '.data.token')

curl -X POST "http://localhost:5000/api/admin/questions/processor/$QUESTION_ID/approve" \
  -H "Authorization: Bearer $TOKEN_PROCESSOR"

# 4. Creator updates
TOKEN_CREATOR=$(curl -s -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"creator@example.com","password":"pass"}' | jq -r '.data.token')

curl -X PUT "http://localhost:5000/api/admin/questions/creator/$QUESTION_ID" \
  -H "Authorization: Bearer $TOKEN_CREATOR" \
  -H "Content-Type: application/json" \
  -d '{...}'

# 5. Processor approves (second time)
curl -X POST "http://localhost:5000/api/admin/questions/processor/$QUESTION_ID/approve" \
  -H "Authorization: Bearer $TOKEN_PROCESSOR"

# 6. Explainer adds explanation
TOKEN_EXPLAINER=$(curl -s -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"explainer@example.com","password":"pass"}' | jq -r '.data.token')

curl -X PUT "http://localhost:5000/api/admin/questions/explainer/$QUESTION_ID/explanation" \
  -H "Authorization: Bearer $TOKEN_EXPLAINER" \
  -H "Content-Type: application/json" \
  -d '{"explanation":"..."}'

# 7. Processor approves (final time)
curl -X POST "http://localhost:5000/api/admin/questions/processor/$QUESTION_ID/approve" \
  -H "Authorization: Bearer $TOKEN_PROCESSOR"

# Question is now completed!
```

---

## ❓ Common Questions

**Q: Can one person have multiple roles?**  
A: No, each user has ONE `adminRole` (gatherer, creator, explainer, or processor). A superadmin can create multiple admin users with different roles.

**Q: What if a processor rejects at any stage?**  
A: The question status becomes `rejected` and the workflow stops. The question cannot proceed further.

**Q: Can a gatherer see questions created by other gatherers?**  
A: No, gatherers can only see their own questions (filtered by `createdBy`).

**Q: How long is a token valid?**  
A: Default is 7 days (configurable via `JWT_EXPIRE` environment variable).

**Q: Can I use the same token for different roles?**  
A: No, each token is tied to a specific user account with a specific role. You need to login as each role separately to get their tokens.

