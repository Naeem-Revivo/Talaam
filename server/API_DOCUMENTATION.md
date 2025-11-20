# Question Management API Documentation

Base URL: `/admin/questions`

All endpoints require authentication with Bearer token in the Authorization header:
```
Authorization: Bearer <your_token>
```

---

## 📋 Shared Endpoints

### 1. Get Topics by Subject
**GET** `/admin/questions/topics/:subjectId`

**Access:** All workflow roles (Gatherer, Creator, Explainer, Processor)

**Parameters:**
- `subjectId` (URL parameter) - The subject ID

**Response:**
```json
{
  "success": true,
  "data": {
    "topics": [
      {
        "id": "507f1f77bcf86cd799439011",
        "name": "Algebra",
        "description": "Basic algebraic concepts"
      }
    ]
  }
}
```

---

## 🔵 Gatherer Endpoints

### 1. Create Question
**POST** `/admin/questions`

**Request Body:**
```json
{
  "exam": "507f1f77bcf86cd799439011",
  "subject": "507f1f77bcf86cd799439012",
  "topic": "507f1f77bcf86cd799439013",
  "questionText": "What is 2 + 2?",
  "questionType": "MCQ",
  "options": {
    "A": "3",
    "B": "4",
    "C": "5",
    "D": "6"
  },
  "correctAnswer": "B",
  "explanation": "2 + 2 equals 4. This is a basic arithmetic operation." // Optional
}
```

**Required Fields:**
- `exam` (ObjectId) - Exam ID
- `subject` (ObjectId) - Subject ID
- `topic` (ObjectId) - Topic ID
- `questionText` (String) - The question text
- `questionType` (String) - One of: "MCQ", "True/False", "Short Answer", "Essay"
- `options` (Object) - Required if questionType is "MCQ"
  - `A` (String) - Option A
  - `B` (String) - Option B
  - `C` (String) - Option C
  - `D` (String) - Option D
- `correctAnswer` (String) - Required if questionType is "MCQ", must be "A", "B", "C", or "D"
- `explanation` (String) - Optional

**Response:**
```json
{
  "success": true,
  "message": "Question created successfully and sent for processor approval",
  "data": {
    "question": {
      "id": "507f1f77bcf86cd799439014",
      "exam": { "id": "...", "name": "Mathematics" },
      "subject": { "id": "...", "name": "Math" },
      "topic": { "id": "...", "name": "Arithmetic" },
      "questionText": "What is 2 + 2?",
      "questionType": "MCQ",
      "options": {
        "A": "3",
        "B": "4",
        "C": "5",
        "D": "6"
      },
      "correctAnswer": "B",
      "explanation": "2 + 2 equals 4. This is a basic arithmetic operation.",
      "status": "pending_processor",
      "createdBy": { "id": "...", "name": "John Doe", "email": "john@example.com" },
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### 2. Get My Questions
**GET** `/admin/questions`

**Query Parameters (Optional):**
- `status` - Filter by status (default: "pending_processor")

**Response:**
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "id": "507f1f77bcf86cd799439014",
        "exam": { "id": "...", "name": "Mathematics" },
        "subject": { "id": "...", "name": "Math" },
        "topic": { "id": "...", "name": "Arithmetic" },
        "questionText": "What is 2 + 2?",
        "questionType": "MCQ",
        "options": {
          "A": "3",
          "B": "4",
          "C": "5",
          "D": "6"
        },
        "correctAnswer": "B",
        "explanation": "...",
        "status": "pending_processor",
        "createdBy": { "id": "...", "name": "John Doe" },
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

### 3. Get Question by ID
**GET** `/admin/questions/:questionId`

**Parameters:**
- `questionId` (URL parameter) - The question ID

**Response:**
```json
{
  "success": true,
  "data": {
    "question": {
      "id": "507f1f77bcf86cd799439014",
      "exam": { "id": "...", "name": "Mathematics" },
      "subject": { "id": "...", "name": "Math" },
      "topic": { "id": "...", "name": "Arithmetic" },
      "questionText": "What is 2 + 2?",
      "questionType": "MCQ",
      "options": {
        "A": "3",
        "B": "4",
        "C": "5",
        "D": "6"
      },
      "correctAnswer": "B",
      "explanation": "...",
      "status": "pending_processor",
      "createdBy": { "id": "...", "name": "John Doe" },
      "lastModifiedBy": null,
      "approvedBy": null,
      "rejectedBy": null,
      "rejectionReason": null,
      "history": [...],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

## 🟢 Creator Endpoints

### 1. Get Pending Questions
**GET** `/admin/questions/creator`

**Query Parameters (Optional):**
- `status` - Filter by status (default: "pending_creator")

**Response:** Same format as Gatherer's "Get My Questions"

### 2. Get Question by ID
**GET** `/admin/questions/creator/:questionId`

**Response:** Same format as Gatherer's "Get Question by ID"

### 3. Update Question
**PUT** `/admin/questions/creator/:questionId`

**Request Body (All fields are optional, but MCQ requires options and correctAnswer):**
```json
{
  "exam": "507f1f77bcf86cd799439011",
  "subject": "507f1f77bcf86cd799439012",
  "topic": "507f1f77bcf86cd799439013",
  "questionText": "What is the result of 2 + 2?",
  "questionType": "MCQ",
  "options": {
    "A": "3",
    "B": "4",
    "C": "5",
    "D": "6"
  },
  "correctAnswer": "B"
}
```

**Note:** 
- If `questionType` is "MCQ", you must provide both `options` and `correctAnswer`
- If updating an existing MCQ question, `correctAnswer` is required

**Response:**
```json
{
  "success": true,
  "message": "Question updated successfully and sent for processor approval",
  "data": {
    "question": {
      "id": "507f1f77bcf86cd799439014",
      "exam": { "id": "...", "name": "Mathematics" },
      "subject": { "id": "...", "name": "Math" },
      "topic": { "id": "...", "name": "Arithmetic" },
      "questionText": "What is the result of 2 + 2?",
      "questionType": "MCQ",
      "options": {
        "A": "3",
        "B": "4",
        "C": "5",
        "D": "6"
      },
      "correctAnswer": "B",
      "explanation": "...",
      "status": "pending_processor",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  }
}
```

---

## 🟡 Explainer Endpoints

### 1. Get Pending Questions
**GET** `/admin/questions/explainer`

**Query Parameters (Optional):**
- `status` - Filter by status (default: "pending_explainer")

**Response:** Same format as Gatherer's "Get My Questions"

### 2. Get Question by ID
**GET** `/admin/questions/explainer/:questionId`

**Response:** Same format as Gatherer's "Get Question by ID"

### 3. Add/Update Explanation
**PUT** `/admin/questions/explainer/:questionId/explanation`

**Request Body:**
```json
{
  "explanation": "The correct answer is 4 because when you add 2 and 2 together, you get 4. This is a fundamental arithmetic operation that demonstrates basic addition."
}
```

**Required Fields:**
- `explanation` (String) - The explanation text (required)

**Response:**
```json
{
  "success": true,
  "message": "Explanation updated successfully and sent for processor approval",
  "data": {
    "question": {
      "id": "507f1f77bcf86cd799439014",
      "explanation": "The correct answer is 4 because when you add 2 and 2 together, you get 4. This is a fundamental arithmetic operation that demonstrates basic addition.",
      "status": "pending_processor",
      "updatedAt": "2024-01-15T12:00:00.000Z"
    }
  }
}
```

---

## 🔴 Processor Endpoints

### 1. Get Pending Questions
**GET** `/admin/questions/processor`

**Query Parameters (Optional):**
- `status` - Filter by status (default: "pending_processor")

**Response:** Same format as Gatherer's "Get My Questions"

### 2. Get Question by ID
**GET** `/admin/questions/processor/:questionId`

**Response:** Same format as Gatherer's "Get Question by ID"

### 3. Approve Question
**POST** `/admin/questions/processor/:questionId/approve`

**Request Body:** None (empty body)

**Response:**
```json
{
  "success": true,
  "message": "Question approved successfully",
  "data": {
    "question": {
      "id": "507f1f77bcf86cd799439014",
      "status": "pending_creator", // or "pending_explainer" or "completed" based on workflow stage
      "approvedBy": { "id": "...", "name": "Processor Name" },
      "updatedAt": "2024-01-15T13:00:00.000Z"
    }
  }
}
```

### 4. Reject Question
**POST** `/admin/questions/processor/:questionId/reject`

**Request Body:**
```json
{
  "rejectionReason": "The question is unclear and needs better formatting."
}
```

**Required Fields:**
- `rejectionReason` (String) - Reason for rejection (optional, defaults to "No reason provided")

**Response:**
```json
{
  "success": true,
  "message": "Question rejected",
  "data": {
    "question": {
      "id": "507f1f77bcf86cd799439014",
      "status": "rejected",
      "rejectedBy": { "id": "...", "name": "Processor Name" },
      "rejectionReason": "The question is unclear and needs better formatting.",
      "updatedAt": "2024-01-15T13:00:00.000Z"
    }
  }
}
```

---

## 📊 Workflow Status Flow

```
Gatherer creates → pending_processor
    ↓ (Processor approves)
pending_creator → Creator updates → pending_processor
    ↓ (Processor approves)
pending_explainer → Explainer adds explanation → pending_processor
    ↓ (Processor approves)
completed
```

**Status Values:**
- `pending_processor` - Waiting for processor approval
- `pending_creator` - Waiting for creator to review/update
- `pending_explainer` - Waiting for explainer to add/update explanation
- `completed` - Question is fully approved and completed
- `rejected` - Question was rejected by processor

---

## ❌ Error Responses

All endpoints may return these error responses:

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "questionText",
      "message": "Question text is required"
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "No token provided. Authorization denied."
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Access denied. Required role: gatherer"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Question not found"
}
```

---

## 📝 Notes

1. All ObjectIds should be valid MongoDB ObjectId strings
2. All text fields are automatically trimmed
3. MCQ questions require all 4 options (A, B, C, D) and a correctAnswer
4. Explanation is optional for Gatherer but required for Explainer
5. Creator must provide correctAnswer when updating MCQ questions
6. Processor can approve or reject questions at any `pending_processor` stage

