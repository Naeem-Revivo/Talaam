# Study Mode & Test Mode Workflow

Complete guide to understanding how Study Mode and Test Mode work in the Talaam system.

---

## 🔐 Prerequisites

**Both Study Mode and Test Mode require:**
- ✅ Student authentication (logged in as student)
- ✅ Basic Plan subscription (tahseely) - **Active and not expired**
- ✅ Questions must be in `completed` status (approved by admin workflow)

---

## 📚 STUDY MODE

### Overview
Study Mode allows students to practice questions one at a time with **immediate feedback** after each answer.

### Key Features:
- ✅ Answer questions one by one
- ✅ Get instant feedback (correct/incorrect)
- ✅ See correct answer immediately
- ✅ View explanation for each question
- ✅ Track study history

---

### Study Mode Workflow

```
┌─────────────────────────────────────────────────────────┐
│                    STUDY MODE FLOW                       │
└─────────────────────────────────────────────────────────┘

1. Student browses available questions
   GET /api/student/questions?exam=...&subject=...&topic=...
   ↓
   Returns: Questions (without correct answers)

2. Student selects a question to study
   GET /api/student/questions/:questionId
   ↓
   Returns: Question details (without correct answer)

3. Student submits answer
   POST /api/student/questions/study
   Body: { questionId, selectedAnswer }
   ↓
   Returns: Immediate feedback
   - isCorrect: true/false
   - correctAnswer: "A"
   - explanation: "..."
   - All question details

4. Student can view study history
   GET /api/student/questions/study/history?exam=...&limit=...
   ↓
   Returns: List of all study attempts
```

---

### Step-by-Step: Study Mode

#### Step 1: Browse Available Questions

**Endpoint:** `GET /api/student/questions`

**Query Parameters:**
- `exam` (optional): Filter by exam ID
- `subject` (optional): Filter by subject ID
- `topic` (optional): Filter by topic ID

**Headers:**
```
Authorization: Bearer <student_token>
```

**Example Request:**
```
GET /api/student/questions?exam=507f1f77bcf86cd799439011
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "id": "507f1f77bcf86cd799439020",
        "questionText": "What is 2 + 2?",
        "questionType": "MCQ",
        "options": {
          "A": "3",
          "B": "4",
          "C": "5",
          "D": "6"
        },
        "exam": { "id": "...", "name": "Math Exam" },
        "subject": { "id": "...", "name": "Mathematics" },
        "topic": { "id": "...", "name": "Basic Arithmetic" }
        // Note: correctAnswer is NOT included
      }
    ],
    "count": 10
  }
}
```

---

#### Step 2: Get Question Details

**Endpoint:** `GET /api/student/questions/:questionId`

**Headers:**
```
Authorization: Bearer <student_token>
```

**Example Request:**
```
GET /api/student/questions/507f1f77bcf86cd799439020
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439020",
    "questionText": "What is 2 + 2?",
    "questionType": "MCQ",
    "options": {
      "A": "3",
      "B": "4",
      "C": "5",
      "D": "6"
    },
    "exam": { "name": "Math Exam" },
    "subject": { "name": "Mathematics" },
    "topic": { "name": "Basic Arithmetic" }
    // Note: correctAnswer is NOT included
  }
}
```

---

#### Step 3: Submit Study Answer ⭐ (Requires Basic Plan)

**Endpoint:** `POST /api/student/questions/study`

**Headers:**
```
Authorization: Bearer <student_token_with_basic_plan>
Content-Type: application/json
```

**Request Body:**
```json
{
  "questionId": "507f1f77bcf86cd799439020",
  "selectedAnswer": "B"
}
```

**Validation:**
- `questionId` is required
- `selectedAnswer` must be one of: `"A"`, `"B"`, `"C"`, `"D"`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "questionId": "507f1f77bcf86cd799439020",
    "selectedAnswer": "B",
    "correctAnswer": "B",
    "isCorrect": true,
    "explanation": "The correct answer is 4 because when you add 2 and 2 together, you get 4.",
    "questionText": "What is 2 + 2?",
    "options": {
      "A": "3",
      "B": "4",
      "C": "5",
      "D": "6"
    },
    "questionType": "MCQ",
    "submittedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Correct answer! ✓"
}
```

**What Happens Behind the Scenes:**
1. ✅ Checks if student has active Basic Plan subscription
2. ✅ Validates question exists and is `completed`
3. ✅ Compares selected answer with correct answer
4. ✅ Saves answer to database (`StudentAnswer` with `mode: 'study'`)
5. ✅ Returns immediate feedback with explanation

**Error Response (403 - No Subscription):**
```json
{
  "status": 403,
  "success": false,
  "message": "Please subscribe to Basic Plan (tahseely) to access study mode and test mode."
}
```

---

#### Step 4: View Study History

**Endpoint:** `GET /api/student/questions/study/history`

**Query Parameters:**
- `exam` (optional): Filter by exam ID
- `question` (optional): Filter by question ID
- `limit` (optional): Limit results (default: 100)

**Headers:**
```
Authorization: Bearer <student_token_with_basic_plan>
```

**Example Request:**
```
GET /api/student/questions/study/history?exam=507f1f77bcf86cd799439011&limit=20
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "history": [
      {
        "_id": "507f1f77bcf86cd799439025",
        "student": "507f1f77bcf86cd799439013",
        "mode": "study",
        "question": {
          "_id": "507f1f77bcf86cd799439020",
          "questionText": "What is 2 + 2?",
          "questionType": "MCQ"
        },
        "selectedAnswer": "B",
        "isCorrect": true,
        "exam": { "name": "Math Exam" },
        "subject": { "name": "Mathematics" },
        "topic": { "name": "Basic Arithmetic" },
        "status": "completed",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "count": 15
  }
}
```

---

## 📝 TEST MODE

### Overview
Test Mode simulates a real exam experience. Students answer multiple questions **without seeing answers** until they submit the entire test.

### Key Features:
- ✅ Answer multiple questions in one session
- ✅ No immediate feedback (like real exam)
- ✅ Submit all answers at once
- ✅ Get complete results with score and percentage
- ✅ View detailed results with explanations
- ✅ Track test history

---

### Test Mode Workflow

```
┌─────────────────────────────────────────────────────────┐
│                    TEST MODE FLOW                        │
└─────────────────────────────────────────────────────────┘

1. Student starts a test
   GET /api/student/questions/test/start?exam=...
   ↓
   Returns: Questions (without correct answers)

2. Student answers all questions (client-side)
   [Student fills answers in UI]

3. Student submits test
   POST /api/student/questions/test/submit
   Body: { examId, answers: [...] }
   ↓
   Returns: Complete results
   - Score (correct/total)
   - Percentage
   - Detailed results for each question
   - Explanations

4. Student can view test history
   GET /api/student/questions/test/history?exam=...

5. Student can view specific test result
   GET /api/student/questions/test/:testId
```

---

### Step-by-Step: Test Mode

#### Step 1: Start a Test ⭐ (Requires Basic Plan)

**Endpoint:** `GET /api/student/questions/test/start`

**Query Parameters:**
- `exam` (required): Exam ID
- `subject` (optional): Filter by subject ID
- `topic` (optional): Filter by topic ID

**Headers:**
```
Authorization: Bearer <student_token_with_basic_plan>
```

**Example Request:**
```
GET /api/student/questions/test/start?exam=507f1f77bcf86cd799439011
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "id": "507f1f77bcf86cd799439020",
        "questionText": "What is 2 + 2?",
        "questionType": "MCQ",
        "options": {
          "A": "3",
          "B": "4",
          "C": "5",
          "D": "6"
        },
        "exam": { "name": "Math Exam" },
        "subject": { "name": "Mathematics" },
        "topic": { "name": "Basic Arithmetic" }
        // Note: correctAnswer is NOT included
      },
      {
        "id": "507f1f77bcf86cd799439021",
        "questionText": "What is 3 × 3?",
        "questionType": "MCQ",
        "options": {
          "A": "6",
          "B": "7",
          "C": "8",
          "D": "9"
        }
      }
    ],
    "count": 10
  },
  "message": "Test started. Answer all questions and submit when done."
}
```

**What Happens:**
- ✅ Checks Basic Plan subscription
- ✅ Fetches all available questions for the exam
- ✅ Returns questions **without correct answers**
- ✅ Student answers questions in UI (no API calls needed)

---

#### Step 2: Submit Test Answers ⭐ (Requires Basic Plan)

**Endpoint:** `POST /api/student/questions/test/submit`

**Headers:**
```
Authorization: Bearer <student_token_with_basic_plan>
Content-Type: application/json
```

**Request Body:**
```json
{
  "examId": "507f1f77bcf86cd799439011",
  "answers": [
    {
      "questionId": "507f1f77bcf86cd799439020",
      "selectedAnswer": "B"
    },
    {
      "questionId": "507f1f77bcf86cd799439021",
      "selectedAnswer": "D"
    },
    {
      "questionId": "507f1f77bcf86cd799439022",
      "selectedAnswer": "A"
    }
  ]
}
```

**Validation:**
- `examId` is required
- `answers` must be a non-empty array
- Each answer must have `questionId` and `selectedAnswer`
- `selectedAnswer` must be one of: `"A"`, `"B"`, `"C"`, `"D"`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "testId": "507f1f77bcf86cd799439030",
    "exam": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Math Exam"
    },
    "summary": {
      "totalQuestions": 10,
      "correctAnswers": 8,
      "incorrectAnswers": 2,
      "score": 8,
      "percentage": 80
    },
    "results": [
      {
        "questionId": "507f1f77bcf86cd799439020",
        "questionText": "What is 2 + 2?",
        "questionType": "MCQ",
        "options": {
          "A": "3",
          "B": "4",
          "C": "5",
          "D": "6"
        },
        "correctAnswer": "B",
        "selectedAnswer": "B",
        "isCorrect": true,
        "explanation": "The correct answer is 4 because when you add 2 and 2 together, you get 4."
      },
      {
        "questionId": "507f1f77bcf86cd799439021",
        "questionText": "What is 3 × 3?",
        "questionType": "MCQ",
        "options": {
          "A": "6",
          "B": "7",
          "C": "8",
          "D": "9"
        },
        "correctAnswer": "D",
        "selectedAnswer": "D",
        "isCorrect": true,
        "explanation": "The correct answer is 9 because 3 multiplied by 3 equals 9."
      },
      {
        "questionId": "507f1f77bcf86cd799439022",
        "questionText": "What is 5 - 2?",
        "questionType": "MCQ",
        "options": {
          "A": "2",
          "B": "3",
          "C": "4",
          "D": "5"
        },
        "correctAnswer": "B",
        "selectedAnswer": "A",
        "isCorrect": false,
        "explanation": "The correct answer is 3 because when you subtract 2 from 5, you get 3."
      }
    ],
    "submittedAt": "2024-01-15T11:00:00.000Z"
  },
  "message": "Test completed! Score: 8/10 (80%)"
}
```

**What Happens Behind the Scenes:**
1. ✅ Checks Basic Plan subscription
2. ✅ Validates exam exists
3. ✅ Validates all questions exist and belong to the exam
4. ✅ Compares each answer with correct answer
5. ✅ Calculates score, percentage, correct/incorrect counts
6. ✅ Saves test results to database (`StudentAnswer` with `mode: 'test'`)
7. ✅ Returns complete results with explanations

---

#### Step 3: View Test History

**Endpoint:** `GET /api/student/questions/test/history`

**Query Parameters:**
- `exam` (optional): Filter by exam ID
- `limit` (optional): Limit results (default: 50)

**Headers:**
```
Authorization: Bearer <student_token_with_basic_plan>
```

**Example Request:**
```
GET /api/student/questions/test/history?exam=507f1f77bcf86cd799439011&limit=10
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "history": [
      {
        "id": "507f1f77bcf86cd799439030",
        "exam": { "id": "...", "name": "Math Exam" },
        "subject": { "id": "...", "name": "Mathematics" },
        "topic": { "id": "...", "name": "Basic Arithmetic" },
        "totalQuestions": 10,
        "correctAnswers": 8,
        "incorrectAnswers": 2,
        "score": 8,
        "percentage": 80,
        "submittedAt": "2024-01-15T11:00:00.000Z"
      },
      {
        "id": "507f1f77bcf86cd799439031",
        "exam": { "id": "...", "name": "Math Exam" },
        "totalQuestions": 15,
        "correctAnswers": 12,
        "incorrectAnswers": 3,
        "score": 12,
        "percentage": 80,
        "submittedAt": "2024-01-14T10:00:00.000Z"
      }
    ],
    "count": 5
  }
}
```

---

#### Step 4: View Detailed Test Result

**Endpoint:** `GET /api/student/questions/test/:testId`

**Headers:**
```
Authorization: Bearer <student_token_with_basic_plan>
```

**Example Request:**
```
GET /api/student/questions/test/507f1f77bcf86cd799439030
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439030",
    "exam": { "id": "...", "name": "Math Exam" },
    "subject": { "id": "...", "name": "Mathematics" },
    "topic": { "id": "...", "name": "Basic Arithmetic" },
    "summary": {
      "totalQuestions": 10,
      "correctAnswers": 8,
      "incorrectAnswers": 2,
      "score": 8,
      "percentage": 80
    },
    "results": [
      {
        "questionId": "507f1f77bcf86cd799439020",
        "questionText": "What is 2 + 2?",
        "questionType": "MCQ",
        "options": {
          "A": "3",
          "B": "4",
          "C": "5",
          "D": "6"
        },
        "correctAnswer": "B",
        "selectedAnswer": "B",
        "isCorrect": true,
        "explanation": "The correct answer is 4 because when you add 2 and 2 together, you get 4."
      }
      // ... more questions
    ],
    "submittedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

## 🔄 Comparison: Study Mode vs Test Mode

| Feature | Study Mode | Test Mode |
|---------|-----------|-----------|
| **Answer Style** | One question at a time | Multiple questions at once |
| **Feedback** | Immediate after each answer | After submitting entire test |
| **Correct Answer** | Shown immediately | Shown after submission |
| **Explanation** | Shown immediately | Shown after submission |
| **Score Calculation** | Per question | Overall test score |
| **Best For** | Learning & practice | Exam simulation |
| **Data Storage** | `mode: 'study'` | `mode: 'test'` |

---

## 📊 Data Storage

### Study Mode Answer
```javascript
{
  student: ObjectId("..."),
  mode: "study",
  question: ObjectId("..."),
  selectedAnswer: "B",
  isCorrect: true,
  exam: ObjectId("..."),
  subject: ObjectId("..."),
  topic: ObjectId("..."),
  status: "completed"
}
```

### Test Mode Answer
```javascript
{
  student: ObjectId("..."),
  mode: "test",
  exam: ObjectId("..."),
  subject: ObjectId("..."),
  topic: ObjectId("..."),
  answers: [
    {
      question: ObjectId("..."),
      selectedAnswer: "B",
      isCorrect: true
    }
  ],
  totalQuestions: 10,
  correctAnswers: 8,
  incorrectAnswers: 2,
  score: 8,
  percentage: 80,
  status: "completed"
}
```

---

## 🛡️ Security & Access Control

### Middleware Protection:
1. **Authentication**: `authMiddleware` - Must be logged in
2. **Role Check**: `studentMiddleware` - Must be a student
3. **Subscription Check**: `verifyBasicPlan` - Must have active Basic Plan

### Access Flow:
```
Request → authMiddleware → studentMiddleware → verifyBasicPlan → Controller
```

### Error Responses:

**401 Unauthorized** (No token/invalid token):
```json
{
  "success": false,
  "message": "No token provided. Authorization denied."
}
```

**403 Forbidden** (Not a student):
```json
{
  "success": false,
  "message": "Access denied. Student privileges required."
}
```

**403 Forbidden** (No Basic Plan):
```json
{
  "status": 403,
  "success": false,
  "message": "Please subscribe to Basic Plan (tahseely) to access study mode and test mode."
}
```

---

## 🎯 Key Points

1. **Both modes require Basic Plan subscription**
2. **Questions must be `completed` status** (approved by admin workflow)
3. **Correct answers are hidden** until submission/feedback
4. **All answers are saved** to `StudentAnswer` collection
5. **History is tracked** separately for study and test modes
6. **Test mode calculates overall score**, study mode tracks per-question

---

## 📝 Complete Example Flow

### Study Mode Example:
```bash
# 1. Browse questions
GET /api/student/questions?exam=507f1f77bcf86cd799439011

# 2. Get question details
GET /api/student/questions/507f1f77bcf86cd799439020

# 3. Submit answer (requires Basic Plan)
POST /api/student/questions/study
Body: { "questionId": "...", "selectedAnswer": "B" }
→ Returns: Immediate feedback with explanation

# 4. View history
GET /api/student/questions/study/history
```

### Test Mode Example:
```bash
# 1. Start test (requires Basic Plan)
GET /api/student/questions/test/start?exam=507f1f77bcf86cd799439011
→ Returns: 10 questions (no answers)

# 2. Student answers in UI (no API call)

# 3. Submit test (requires Basic Plan)
POST /api/student/questions/test/submit
Body: { "examId": "...", "answers": [...] }
→ Returns: Complete results with score

# 4. View test history
GET /api/student/questions/test/history

# 5. View specific test result
GET /api/student/questions/test/507f1f77bcf86cd799439030
```

---

This workflow ensures students can practice effectively while maintaining proper access control and data tracking.

