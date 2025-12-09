# Question Workflow - Complete Status Documentation

## Overview
This document shows all possible workflow cases, status transitions, and what status is displayed in tables for each role.

---

## Status Values

### Database Statuses:
- `pending_processor` - Waiting for processor review
- `pending_creator` - Waiting for creator action
- `pending_explainer` - Waiting for explainer action
- `pending_gatherer` - Waiting for gatherer action (after flag)
- `completed` - Question is fully completed
- `rejected` - Question was rejected

### Flag Statuses:
- `isFlagged: false` - No flag
- `isFlagged: true` + `flagStatus: 'pending'` - Flag pending processor review
- `isFlagged: true` + `flagStatus: 'approved'` - Flag approved, sent for correction
- `isFlagged: true` + `flagStatus: 'rejected'` - Flag rejected by processor
- `flagType: 'creator'` - Flagged by creator
- `flagType: 'explainer'` - Flagged by explainer

### Table Display Statuses (Frontend):
- **Processor Status**: "Pending Review", "Approved", "Rejected"
- **Creator Status**: "Pending", "Approved", "Rejected", "Flag", "Variant Created"
- **Explainer Status**: "Pending", "Approved", "Rejected", "Flag"

---

## 1. NORMAL FLOW (No Flags, No Rejections)

### Step-by-Step:

| Step | Action | By | Status | Flag Status | Table Display |
|------|--------|----|--------|-------------|---------------|
| 1 | Create Question | Gatherer | `pending_processor` | `isFlagged: false` | **Processor**: Pending Review<br>**Gatherer**: Pending Review |
| 2 | Approve | Processor | `pending_creator` | `isFlagged: false` | **Processor**: Approved<br>**Creator**: Pending |
| 3 | Submit/Approve | Creator | `pending_processor` | `isFlagged: false` | **Processor**: Pending Review<br>**Creator**: Pending |
| 4 | Approve | Processor | `pending_explainer` | `isFlagged: false` | **Processor**: Approved<br>**Creator**: Approved<br>**Explainer**: Pending |
| 5 | Add Explanation | Explainer | `pending_processor` | `isFlagged: false` | **Processor**: Pending Review<br>**Explainer**: Pending |
| 6 | Approve | Processor | `completed` | `isFlagged: false` | **Processor**: Approved<br>**Creator**: Approved<br>**Explainer**: Approved |

**Final Status**: `completed`

---

## 2. REJECTION FLOW

### 2.1 Rejection at Step 1 (After Gatherer Creates)

| Step | Action | By | Status | Flag Status | Table Display |
|------|--------|----|--------|-------------|---------------|
| 1 | Create Question | Gatherer | `pending_processor` | `isFlagged: false` | **Processor**: Pending Review |
| 2 | Reject | Processor | `rejected` | `isFlagged: false` | **Processor**: Rejected<br>**Gatherer**: Rejected |

**Final Status**: `rejected` (stays rejected, gatherer can see it)

---

### 2.2 Rejection at Step 3 (After Creator Submits)

| Step | Action | By | Status | Flag Status | Table Display |
|------|--------|----|--------|-------------|---------------|
| 1 | Create Question | Gatherer | `pending_processor` | `isFlagged: false` | **Processor**: Pending Review |
| 2 | Approve | Processor | `pending_creator` | `isFlagged: false` | **Processor**: Approved<br>**Creator**: Pending |
| 3 | Submit/Approve | Creator | `pending_processor` | `isFlagged: false` | **Processor**: Pending Review<br>**Creator**: Pending |
| 4 | Reject | Processor | `rejected` | `isFlagged: false` | **Processor**: Rejected<br>**Creator**: Rejected |

**Final Status**: `rejected`

---

### 2.3 Rejection at Step 5 (After Explainer Submits)

| Step | Action | By | Status | Flag Status | Table Display |
|------|--------|----|--------|-------------|---------------|
| 1-4 | (Same as normal flow) | - | `pending_explainer` | `isFlagged: false` | **Explainer**: Pending |
| 5 | Add Explanation | Explainer | `pending_processor` | `isFlagged: false` | **Processor**: Pending Review<br>**Explainer**: Pending |
| 6 | Reject | Processor | `rejected` | `isFlagged: false` | **Processor**: Rejected<br>**Explainer**: Rejected |

**Final Status**: `rejected`

---

## 3. CREATOR FLAG FLOW

### 3.1 Creator Flags → Processor Approves Flag → Gatherer Updates → Processor Approves

| Step | Action | By | Status | Flag Status | Table Display |
|------|--------|----|--------|-------------|---------------|
| 1-2 | (Normal flow to creator) | - | `pending_creator` | `isFlagged: false` | **Creator**: Pending |
| 3 | Flag Question | Creator | `pending_processor` | `isFlagged: true`<br>`flagStatus: 'pending'`<br>`flagType: 'creator'` | **Processor**: Pending Review<br>**Creator**: Flag |
| 4 | Approve Flag | Processor | `pending_gatherer` | `isFlagged: true`<br>`flagStatus: 'approved'`<br>`flagType: 'creator'` | **Processor**: Pending Review<br>**Gatherer**: Pending My Action |
| 5 | Update Question | Gatherer | `pending_processor` | `isFlagged: true`<br>`flagStatus: 'approved'`<br>`flagType: 'creator'` | **Processor**: Pending Review<br>**Gatherer**: Pending Review |
| 6 | Approve | Processor | `pending_creator` | `isFlagged: false`<br>`flagStatus: null`<br>`flagType: null` | **Processor**: Approved<br>**Creator**: Pending |

**Final Status**: `pending_creator` (back to creator for review)

---

### 3.2 Creator Flags → Processor Rejects Flag → Back to Creator

| Step | Action | By | Status | Flag Status | Table Display |
|------|--------|----|--------|-------------|---------------|
| 1-2 | (Normal flow to creator) | - | `pending_creator` | `isFlagged: false` | **Creator**: Pending |
| 3 | Flag Question | Creator | `pending_processor` | `isFlagged: true`<br>`flagStatus: 'pending'`<br>`flagType: 'creator'` | **Processor**: Pending Review<br>**Creator**: Flag |
| 4 | Reject Flag | Processor | `pending_creator` | `isFlagged: false`<br>`flagStatus: 'rejected'`<br>`flagType: null` | **Processor**: Approved<br>**Creator**: Pending |

**Final Status**: `pending_creator` (back to creator, flag removed)

---

### 3.3 Creator Flags → Gatherer Rejects Flag → Processor Approves

| Step | Action | By | Status | Flag Status | Table Display |
|------|--------|----|--------|-------------|---------------|
| 1-3 | (Same as 3.1) | - | `pending_gatherer` | `isFlagged: true`<br>`flagStatus: 'approved'`<br>`flagType: 'creator'` | **Gatherer**: Pending My Action |
| 4 | Reject Flag | Gatherer | `pending_processor` | `isFlagged: false`<br>`flagStatus: null`<br>`flagRejectionReason: "..."` | **Processor**: Pending Review<br>**Gatherer**: Pending Review |
| 5 | Approve | Processor | `pending_creator` | `isFlagged: false`<br>`flagStatus: null`<br>`flagRejectionReason: null` | **Processor**: Approved<br>**Creator**: Pending |

**Final Status**: `pending_creator` (gatherer's rejection accepted)

---

## 4. EXPLAINER FLAG FLOW

### 4.1 Explainer Flags Regular Question → Processor Approves → Gatherer Updates → Processor Approves

| Step | Action | By | Status | Flag Status | Table Display |
|------|--------|----|--------|-------------|---------------|
| 1-4 | (Normal flow to explainer) | - | `pending_explainer` | `isFlagged: false` | **Explainer**: Pending |
| 5 | Flag Question | Explainer | `pending_processor` | `isFlagged: true`<br>`flagStatus: 'pending'`<br>`flagType: 'explainer'` | **Processor**: Pending Review<br>**Explainer**: Flag |
| 6 | Approve Flag | Processor | `pending_gatherer` | `isFlagged: true`<br>`flagStatus: 'approved'`<br>`flagType: 'explainer'` | **Processor**: Pending Review<br>**Gatherer**: Pending My Action |
| 7 | Update Question | Gatherer | `pending_processor` | `isFlagged: true`<br>`flagStatus: 'approved'`<br>`flagType: 'explainer'` | **Processor**: Pending Review<br>**Gatherer**: Pending Review |
| 8 | Approve | Processor | `pending_explainer` | `isFlagged: false`<br>`flagStatus: null`<br>`flagType: null` | **Processor**: Approved<br>**Explainer**: Pending |

**Final Status**: `pending_explainer` (back to explainer, NOT creator)

---

### 4.2 Explainer Flags Variant → Processor Approves → Creator Updates → Processor Approves

| Step | Action | By | Status | Flag Status | Table Display |
|------|--------|----|--------|-------------|---------------|
| 1-4 | (Normal flow to explainer) | - | `pending_explainer` | `isFlagged: false` | **Explainer**: Pending |
| 5 | Flag Variant | Explainer | `pending_processor` | `isFlagged: true`<br>`flagStatus: 'pending'`<br>`flagType: 'explainer'` | **Processor**: Pending Review<br>**Explainer**: Flag |
| 6 | Approve Flag | Processor | `pending_creator` | `isFlagged: true`<br>`flagStatus: 'approved'`<br>`flagType: 'explainer'` | **Processor**: Pending Review<br>**Creator**: Flag |
| 7 | Update Variant | Creator | `pending_processor` | `isFlagged: true`<br>`flagStatus: 'approved'`<br>`flagType: 'explainer'` | **Processor**: Pending Review<br>**Creator**: Pending |
| 8 | Approve | Processor | `pending_explainer` | `isFlagged: false`<br>`flagStatus: null`<br>`flagType: null` | **Processor**: Approved<br>**Explainer**: Pending |

**Final Status**: `pending_explainer` (back to explainer, NOT creator)

---

### 4.3 Explainer Flags → Processor Rejects Flag → Back to Explainer

| Step | Action | By | Status | Flag Status | Table Display |
|------|--------|----|--------|-------------|---------------|
| 1-4 | (Normal flow to explainer) | - | `pending_explainer` | `isFlagged: false` | **Explainer**: Pending |
| 5 | Flag Question | Explainer | `pending_processor` | `isFlagged: true`<br>`flagStatus: 'pending'`<br>`flagType: 'explainer'` | **Processor**: Pending Review<br>**Explainer**: Flag |
| 6 | Reject Flag | Processor | `pending_explainer` | `isFlagged: false`<br>`flagStatus: 'rejected'`<br>`flagType: null` | **Processor**: Approved<br>**Explainer**: Pending |

**Final Status**: `pending_explainer` (back to explainer, flag removed)

---

### 4.4 Explainer Flags → Gatherer Rejects Flag → Processor Approves

| Step | Action | By | Status | Flag Status | Table Display |
|------|--------|----|--------|-------------|---------------|
| 1-5 | (Same as 4.1) | - | `pending_gatherer` | `isFlagged: true`<br>`flagStatus: 'approved'`<br>`flagType: 'explainer'` | **Gatherer**: Pending My Action |
| 6 | Reject Flag | Gatherer | `pending_processor` | `isFlagged: false`<br>`flagStatus: null`<br>`flagRejectionReason: "..."` | **Processor**: Pending Review<br>**Gatherer**: Pending Review |
| 7 | Approve | Processor | `pending_explainer` | `isFlagged: false`<br>`flagStatus: null`<br>`flagRejectionReason: null` | **Processor**: Approved<br>**Explainer**: Pending |

**Final Status**: `pending_explainer` (gatherer's rejection accepted, back to explainer)

---

## 5. VARIANT CREATION FLOW

### 5.1 Creator Creates Variant

| Step | Action | By | Status | Flag Status | Table Display |
|------|--------|----|--------|-------------|---------------|
| 1-2 | (Normal flow to creator) | - | `pending_creator` | `isFlagged: false` | **Creator**: Pending |
| 3 | Create Variant | Creator | `pending_processor` | `isFlagged: false`<br>`isVariant: true` | **Processor**: Pending Review<br>**Creator**: Variant Created |

**Note**: Original question status remains `pending_processor`, variant is new question with `isVariant: true`

---

## 6. TABLE STATUS MAPPING BY ROLE

### 6.1 Processor Tables

#### Gatherer Submission Table:
- Status: `pending_processor` → **"Pending Review"**
- Status: `pending_creator` → **"Approved"**
- Status: `pending_explainer` → **"Approved"**
- Status: `completed` → **"Approved"**
- Status: `rejected` → **"Rejected"**
- Status: `flagged` (with isFlagged=true) → **"Pending Review"**

#### Creator Submission Table:
- Status: `pending_processor` + not flagged → **"Pending Review"** (Creator submitted)
- Status: `pending_processor` + flagged → **"Pending Review"** (Creator flagged)
- Status: `pending_explainer` → **"Approved"** (Sent to explainer)
- Status: `completed` → **"Approved"**
- Status: `rejected` → **"Rejected"**
- isFlagged: true → **Creator Status: "Flag"**

#### Explainer Submission Table:
- Status: `pending_explainer` → **"Pending Review"** (Assigned to explainer)
- Status: `pending_processor` + has explanation → **"Pending Review"** (Explainer submitted)
- Status: `pending_processor` + flagged → **"Pending Review"** (Explainer flagged)
- Status: `completed` → **"Approved"**
- isFlagged: true → **Explainer Status: "Flag"**

---

### 6.2 Creator Table (AssignedQuestionPage)

- Status: `pending_creator` → **"Pending"**
- Status: `pending_processor` + has approvedBy → **"Approved"** (Submitted back)
- Status: `pending_explainer` → **"Approved"** (Sent to explainer)
- Status: `completed` → **"Approved"**
- Status: `rejected` → **"Rejected"**
- isFlagged: true → **"Flag"**
- hasVariants + status: `pending_processor` → **"Variant Created"**

---

### 6.3 Explainer Table (ExplainerQuestionBank)

- Status: `pending_explainer` → **"Pending"**
- Status: `pending_processor` + has explanation → **"Approved"** (Submitted)
- Status: `completed` → **"Approved"**
- isFlagged: true → **"Flag"**

---

### 6.4 Gatherer Table (GathererQuestionBank)

- Status: `pending_gatherer` → **"Pending My Action"** (Flagged question)
- Status: `pending_processor` → **"Pending Review"**
- Status: `pending_creator` → **"Pending Creator"**
- Status: `pending_explainer` → **"Pending Explainer"**
- Status: `completed` → **"Completed"**
- Status: `rejected` → **"Rejected"**
- isFlagged: true → **"Flagged"**

---

## 7. KEY RULES

### 7.1 Flag Routing Rules:
1. **Creator Flag**: After resolution → Always goes to `pending_creator`
2. **Explainer Flag**: After resolution → Always goes to `pending_explainer` (NOT creator)
3. **Flag Removal**: Flags are cleared when processor approves after update

### 7.2 Status Transition Rules:
1. Gatherer creates → `pending_processor`
2. Processor approves → `pending_creator` (normal) OR `pending_explainer` (if explainer flag)
3. Creator submits → `pending_processor`
4. Processor approves → `pending_explainer` (normal) OR `pending_creator` (if creator flag)
5. Explainer submits → `pending_processor`
6. Processor approves → `completed`

### 7.3 Flag Status Rules:
- `flagStatus: 'pending'` → Flag waiting for processor review
- `flagStatus: 'approved'` → Flag approved, sent for correction
- `flagStatus: 'rejected'` → Flag rejected by processor
- When processor approves updated question → All flag fields cleared

---

## 8. EDGE CASES

### 8.1 Direct Flag Approval (No Update)
- Processor approves flagged question directly → Routes based on `flagType`
- Creator flag → `pending_creator`
- Explainer flag → `pending_explainer`

### 8.2 Flag Cleared But flagType Exists
- If `flagType === 'explainer'` but `isFlagged === false` → Still route to `pending_explainer`
- Prevents explainer-flagged questions from going to creator

### 8.3 Gatherer Updates After Flag
- If `flagType === 'explainer'` → Route to `pending_explainer` (not creator)
- If `flagType === 'creator'` → Route to `pending_creator`

---

## Summary

**Total Possible Statuses**: 6
- `pending_processor`
- `pending_creator`
- `pending_explainer`
- `pending_gatherer`
- `completed`
- `rejected`

**Flag States**: 3
- `pending` - Waiting for processor review
- `approved` - Flag approved, sent for correction
- `rejected` - Flag rejected

**Flag Types**: 2
- `creator` - Flagged by creator
- `explainer` - Flagged by explainer

