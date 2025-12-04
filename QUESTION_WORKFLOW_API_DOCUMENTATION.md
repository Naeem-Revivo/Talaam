# Question Workflow API Documentation

Complete API documentation for the question workflow from Gatherer → Processor → Creator → Explainer, including flagging workflows.

**Base URL:** `/api/admin/questions`

All endpoints require authentication via `authMiddleware` and role-specific middleware.

---

## 📋 Table of Contents

1. [Gatherer Endpoints](#gatherer-endpoints)
2. [Processor Endpoints](#processor-endpoints)
3. [Creator Endpoints](#creator-endpoints)
4. [Explainer Endpoints](#explainer-endpoints)
5. [Common Endpoints](#common-endpoints)

---

## 🔵 Gatherer Endpoints

### 1. Create Question
**POST** `/api/admin/questions`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "exam": "exam-uuid",
  "subject": "subject-uuid",
  "topic": "topic-uuid",
  "questionText": "What is the capital of France?",
  "questionType": "MCQ",
  "options": {
    "A": "London",
    "B": "Paris",
    "C": "Berlin",
    "D": "Madrid"
  },
  "correctAnswer": "B",
  "explanation": "" // Optional
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Question created successfully and sent for processor approval",
  "data": {
    "question": {
      "id": "question-uuid",
      "exam": { "id": "exam-uuid", "name": "Exam Name" },
      "subject": { "id": "subject-uuid", "name": "Subject Name" },
      "topic": { "id": "topic-uuid", "name": "Topic Name" },
      "questionText": "What is the capital of France?",
      "questionType": "MCQ",
      "options": {
        "A": "London",
        "B": "Paris",
        "C": "Berlin",
        "D": "Madrid"
      },
      "correctAnswer": "B",
      "explanation": "",
      "status": "pending_processor",
      "createdBy": { "id": "user-uuid", "name": "User Name", "email": "user@example.com" },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Response (400 Bad Request):**
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

---

### 2. Get Questions (Gatherer)
**GET** `/api/admin/questions`

**Query Parameters:**
- `status` (optional): Filter by status (default: `pending_processor`)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "id": "question-uuid",
        "exam": { "id": "exam-uuid", "name": "Exam Name" },
        "subject": { "id": "subject-uuid", "name": "Subject Name" },
        "topic": { "id": "topic-uuid", "name": "Topic Name" },
        "questionText": "Question text here",
        "questionType": "MCQ",
        "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
        "correctAnswer": "B",
        "explanation": "",
        "status": "pending_processor",
        "createdBy": { "id": "user-uuid", "name": "User Name", "email": "user@example.com" },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

### 3. Get Question by ID (Gatherer)
**GET** `/api/admin/questions/:questionId`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "question": {
      "id": "question-uuid",
      "exam": { "id": "exam-uuid", "name": "Exam Name" },
      "subject": { "id": "subject-uuid", "name": "Subject Name" },
      "topic": { "id": "topic-uuid", "name": "Topic Name" },
      "questionText": "Question text here",
      "questionType": "MCQ",
      "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "correctAnswer": "B",
      "explanation": "",
      "status": "pending_processor",
      "createdBy": { "id": "user-uuid", "name": "User Name", "email": "user@example.com" },
      "lastModifiedBy": null,
      "approvedBy": null,
      "rejectedBy": null,
      "rejectionReason": null,
      "originalQuestion": null,
      "isVariant": false,
      "history": [],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

## 🟢 Processor Endpoints

### 4. Get Questions (Processor)
**GET** `/api/admin/questions/processor`

**Query Parameters:**
- `status` (optional): Filter by status (default: `pending_processor`)

**Response:** Same structure as Gatherer Get Questions

---

### 5. Get Question by ID (Processor)
**GET** `/api/admin/questions/processor/:questionId`

**Response:** Same structure as Gatherer Get Question by ID

---

### 6. Approve Question
**POST** `/api/admin/questions/processor/:questionId/approve`

**Request Body:**
```json
{
  "status": "approve"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Question approved successfully",
  "data": {
    "question": {
      "id": "question-uuid",
      "status": "pending_creator", // or "pending_explainer" or "completed"
      "approvedBy": { "id": "user-uuid", "name": "Processor Name", "email": "processor@example.com" },
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### 7. Reject Question
**POST** `/api/admin/questions/processor/:questionId/reject`

**Request Body:**
```json
{
  "status": "reject",
  "rejectionReason": "Question is unclear and needs more context."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Question rejected",
  "data": {
    "question": {
      "id": "question-uuid",
      "status": "rejected",
      "rejectedBy": { "id": "user-uuid", "name": "Processor Name", "email": "processor@example.com" },
      "rejectionReason": "Question is unclear and needs more context.",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### 8. Review Creator Flag
**POST** `/api/admin/questions/processor/:questionId/flag/review`

**Request Body (Approve):**
```json
{
  "decision": "approve"
}
```

**Request Body (Reject):**
```json
{
  "decision": "reject",
  "rejectionReason": "The question is correct as is."
}
```

**Response (200 OK - Approve):**
```json
{
  "success": true,
  "message": "Flag approved. Question sent back to gatherer for correction.",
  "data": {
    "question": {
      "id": "question-uuid",
      "isFlagged": true,
      "flagStatus": "approved",
      "flagRejectionReason": null,
      "status": "pending_gatherer",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Response (200 OK - Reject):**
```json
{
  "success": true,
  "message": "Flag rejected. Question sent back to creator.",
  "data": {
    "question": {
      "id": "question-uuid",
      "isFlagged": false,
      "flagStatus": "rejected",
      "flagRejectionReason": "The question is correct as is.",
      "status": "pending_creator",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### 9. Review Explainer Flag
**POST** `/api/admin/questions/processor/:questionId/variant-flag/review`

**Request Body (Approve):**
```json
{
  "decision": "approve"
}
```

**Request Body (Reject):**
```json
{
  "decision": "reject",
  "rejectionReason": "The question variant is correct as is."
}
```

**Response (200 OK - Approve for Variant):**
```json
{
  "success": true,
  "message": "Flag approved. Question variant sent back to creator for correction.",
  "data": {
    "question": {
      "id": "question-uuid",
      "isVariant": true,
      "isFlagged": true,
      "flagStatus": "approved",
      "flagRejectionReason": null,
      "status": "pending_creator",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Response (200 OK - Approve for Regular Question):**
```json
{
  "success": true,
  "message": "Flag approved. Question sent back to gatherer for correction.",
  "data": {
    "question": {
      "id": "question-uuid",
      "isVariant": false,
      "isFlagged": true,
      "flagStatus": "approved",
      "flagRejectionReason": null,
      "status": "pending_gatherer",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Response (200 OK - Reject):**
```json
{
  "success": true,
  "message": "Flag rejected. Question sent back to explainer.",
  "data": {
    "question": {
      "id": "question-uuid",
      "isVariant": false,
      "isFlagged": false,
      "flagStatus": "rejected",
      "flagRejectionReason": "The question variant is correct as is.",
      "status": "pending_explainer",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

## 🟡 Creator Endpoints

### 10. Get Questions (Creator)
**GET** `/api/admin/questions/creator`

**Query Parameters:**
- `status` (optional): Filter by status (default: `pending_creator`)

**Response:** Same structure as Gatherer Get Questions

---

### 11. Get Question by ID (Creator)
**GET** `/api/admin/questions/creator/:questionId`

**Response:** Same structure as Gatherer Get Question by ID

---

### 12. Update Question
**PUT** `/api/admin/questions/creator/:questionId`

**Request Body:**
```json
{
  "exam": "exam-uuid", // Optional
  "subject": "subject-uuid", // Optional
  "topic": "topic-uuid", // Optional
  "questionText": "Updated question text",
  "questionType": "MCQ",
  "options": {
    "A": "Option A",
    "B": "Option B",
    "C": "Option C",
    "D": "Option D"
  },
  "correctAnswer": "A"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Question updated successfully and sent for processor approval",
  "data": {
    "question": {
      "id": "question-uuid",
      "exam": { "id": "exam-uuid", "name": "Exam Name" },
      "subject": { "id": "subject-uuid", "name": "Subject Name" },
      "topic": { "id": "topic-uuid", "name": "Topic Name" },
      "questionText": "Updated question text",
      "questionType": "MCQ",
      "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "correctAnswer": "A",
      "explanation": "",
      "status": "pending_processor",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### 13. Flag Question
**POST** `/api/admin/questions/creator/:questionId/flag`

**Request Body:**
```json
{
  "flagReason": "The question has incorrect information and needs to be corrected."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Question flagged successfully and sent to processor for review",
  "data": {
    "question": {
      "id": "question-uuid",
      "isFlagged": true,
      "flagReason": "The question has incorrect information and needs to be corrected.",
      "flagType": "creator",
      "flagStatus": "pending",
      "status": "pending_processor",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### 14. Create Question Variant
**POST** `/api/admin/questions/creator/:questionId/variant`

**Request Body:**
```json
{
  "exam": "exam-uuid", // Optional (uses original if not provided)
  "subject": "subject-uuid", // Optional
  "topic": "topic-uuid", // Optional
  "questionText": "Variant question text",
  "questionType": "MCQ",
  "options": {
    "A": "Option A",
    "B": "Option B",
    "C": "Option C",
    "D": "Option D"
  },
  "correctAnswer": "B",
  "explanation": "Explanation for variant" // Optional
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Question variant created successfully",
  "data": {
    "question": {
      "id": "variant-uuid",
      "exam": { "id": "exam-uuid", "name": "Exam Name" },
      "subject": { "id": "subject-uuid", "name": "Subject Name" },
      "topic": { "id": "topic-uuid", "name": "Topic Name" },
      "questionText": "Variant question text",
      "questionType": "MCQ",
      "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "correctAnswer": "B",
      "explanation": "Explanation for variant",
      "originalQuestion": { "id": "original-question-uuid", "questionText": "...", "questionType": "MCQ" },
      "isVariant": true,
      "status": "pending_processor",
      "createdBy": { "id": "user-uuid", "name": "Creator Name", "email": "creator@example.com" },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

## 🟣 Explainer Endpoints

### 15. Get Questions (Explainer)
**GET** `/api/admin/questions/explainer`

**Query Parameters:**
- `status` (optional): Filter by status (default: `pending_explainer`)

**Response:** Same structure as Gatherer Get Questions

---

### 16. Get Question by ID (Explainer)
**GET** `/api/admin/questions/explainer/:questionId`

**Response:** Same structure as Gatherer Get Question by ID

---

### 17. Update Explanation
**PUT** `/api/admin/questions/explainer/:questionId/explanation`

**Request Body:**
```json
{
  "explanation": "The correct answer is B because Paris is the capital of France. London is the capital of England, Berlin is the capital of Germany, and Madrid is the capital of Spain."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Explanation updated successfully and sent for processor approval",
  "data": {
    "question": {
      "id": "question-uuid",
      "explanation": "The correct answer is B because Paris is the capital of France. London is the capital of England, Berlin is the capital of Germany, and Madrid is the capital of Spain.",
      "status": "pending_processor",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### 18. Flag Question or Variant
**POST** `/api/admin/questions/explainer/:questionId/flag`

**Request Body:**
```json
{
  "flagReason": "The question variant has incorrect options that need to be corrected."
}
```

**Response (200 OK - for Variant):**
```json
{
  "success": true,
  "message": "Question variant flagged successfully and sent to processor for review",
  "data": {
    "question": {
      "id": "question-uuid",
      "isVariant": true,
      "isFlagged": true,
      "flagReason": "The question variant has incorrect options that need to be corrected.",
      "flagType": "explainer",
      "flagStatus": "pending",
      "status": "pending_processor",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Response (200 OK - for Regular Question):**
```json
{
  "success": true,
  "message": "Question flagged successfully and sent to processor for review",
  "data": {
    "question": {
      "id": "question-uuid",
      "isVariant": false,
      "isFlagged": true,
      "flagReason": "The question has incorrect information.",
      "flagType": "explainer",
      "flagStatus": "pending",
      "status": "pending_processor",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

## 🔧 Common Endpoints

### 19. Get Topics by Subject
**GET** `/api/admin/questions/topics/:subjectId`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "topics": [
      {
        "id": "topic-uuid",
        "name": "Topic Name",
        "description": "Topic description"
      }
    ]
  }
}
```

---

## 📊 Workflow Status Values

- `pending_processor` - Waiting for processor review
- `pending_creator` - Waiting for creator to work on
- `pending_explainer` - Waiting for explainer to add explanation
- `pending_gatherer` - Waiting for gatherer to correct (after flag)
- `completed` - Question is complete
- `rejected` - Question was rejected

---

## 🔴 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "fieldName",
      "message": "Error message"
    }
  ]
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Question not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 🔄 Complete Workflow Example

### Normal Flow:
1. **Gatherer** creates question → `pending_processor`
2. **Processor** approves → `pending_creator`
3. **Creator** updates question → `pending_processor`
4. **Processor** approves → `pending_explainer`
5. **Explainer** adds explanation → `pending_processor`
6. **Processor** approves → `completed`

### Creator Flag Flow:
1. **Creator** flags question → `pending_processor` (with flag)
2. **Processor** reviews flag:
   - **Approve**: → `pending_gatherer` (Gatherer corrects)
   - **Reject**: → `pending_creator` (flag removed)
3. If approved: **Gatherer** updates → `pending_processor`
4. **Processor** approves → flag removed, continues normal flow

### Explainer Flag Flow (Variant):
1. **Explainer** flags variant → `pending_processor` (with flag)
2. **Processor** reviews flag:
   - **Approve**: → `pending_creator` (Creator corrects)
   - **Reject**: → `pending_explainer` (flag removed)
3. If approved: **Creator** updates variant → `pending_processor`
4. **Processor** approves → flag removed, continues normal flow

### Explainer Flag Flow (Regular Question):
1. **Explainer** flags question → `pending_processor` (with flag)
2. **Processor** reviews flag:
   - **Approve**: → `pending_gatherer` (Gatherer corrects)
   - **Reject**: → `pending_explainer` (flag removed)
3. If approved: **Gatherer** updates → `pending_processor`
4. **Processor** approves → flag removed, continues normal flow

---

## 📝 Notes

- All UUIDs are strings
- All timestamps are in ISO 8601 format
- All endpoints require authentication
- Role-based access control is enforced
- Question types: `MCQ`, `True/False`, `Short Answer`, `Essay`
- For MCQ questions, `options` must have A, B, C, D
- `correctAnswer` for MCQ must be one of: `A`, `B`, `C`, `D`

