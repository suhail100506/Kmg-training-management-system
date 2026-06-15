# KMG Training Management System (TMS)
## Complete Project Documentation

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [System Architecture](#3-system-architecture)
4. [User Roles & Permissions](#4-user-roles--permissions)
   - 4.1 [Super Admin](#41-super-admin)
   - 4.2 [Admin](#42-admin)
   - 4.3 [Permission Matrix](#43-permission-matrix)
5. [Database Models](#5-database-models)
6. [Authentication & Security](#6-authentication--security)
7. [Complete Page-by-Page Breakdown](#7-complete-page-by-page-breakdown)
   - 7.1 [Login Page](#71-login-page)
   - 7.2 [Change Password Page](#72-change-password-page)
   - 7.3 [Dashboard Page](#73-dashboard-page)
   - 7.4 [Staff List Page](#74-staff-list-page)
   - 7.5 [Staff Add Page](#75-staff-add-page)
   - 7.6 [Staff Edit Page](#76-staff-edit-page)
   - 7.7 [Training List Page](#77-training-list-page)
   - 7.8 [Training Add Page](#78-training-add-page)
   - 7.9 [Training Edit Page](#79-training-edit-page)
   - 7.10 [Training View Page](#710-training-view-page)
   - 7.11 [User List Page (Super Admin Only)](#711-user-list-page-super-admin-only)
   - 7.12 [User Add Page (Super Admin Only)](#712-user-add-page-super-admin-only)
   - 7.13 [User Edit Page (Super Admin Only)](#713-user-edit-page-super-admin-only)
   - 7.14 [Bulk Upload Page](#714-bulk-upload-page)
   - 7.15 [Upload Batch List Page](#715-upload-batch-list-page)
   - 7.16 [Upload Batch Detail Page](#716-upload-batch-detail-page)
   - 7.17 [Master Data Configuration Page](#717-master-data-configuration-page)
   - 7.18 [Reports Pages (8 Report Types)](#718-reports-pages)
   - 7.19 [Audit Log Page (Super Admin Only)](#719-audit-log-page-super-admin-only)
   - 7.20 [Settings Page](#720-settings-page)
8. [API Routes Reference](#8-api-routes-reference)
9. [Workflow Diagrams](#9-workflow-diagrams)
10. [Business Rules & Validations](#10-business-rules--validations)
11. [Key Features Summary](#11-key-features-summary)
12. [Deployment & Environment Configuration](#12-deployment--environment-configuration)

---

## 1. Project Overview

The **KMG Training Management System (KMG-TMS)** is a full-stack enterprise-grade web application built to track, manage, and report on employee training activities for the KMG organization. The system enables authorized administrators to log training records, manage staff master data, upload bulk training records via Excel/CSV, and generate comprehensive analytical reports including monthly, quarterly, financial year, department-wise, cost-analysis, and beneficiary reports.

### Core Problems Solved

| Problem | Solution |
|---------|----------|
| Manual Excel-based tracking of training data | Centralized digital database with CRUD operations |
| No real-time visibility into training coverage | Live dashboard with KPI cards and analytics charts |
| Slow individual-record entry for bulk training data | Bulk Excel/CSV upload with row-level validation |
| No accountability for who changed what data | Full Audit Log system recording every write action |
| Inconsistent dropdown values across forms | Master Data Configuration module |
| No cost tracking per training program | Financial cost per person field on every record |

### Project Scale

- **Frontend**: React 18 + Vite + TailwindCSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (Access Token + Refresh Token with httpOnly cookie)
- **Deployment**: Single monorepo with `client/` and `server/` directories

---

## 2. Technology Stack

### Frontend (Client)

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | React 18 (JSX) | Component-based UI |
| Build Tool | Vite | Fast HMR development server |
| Styling | TailwindCSS | Utility-first responsive styling |
| Charts | Recharts | Bar, Pie, Line, Area charts on Dashboard |
| Icons | Lucide React | Consistent icon library |
| Routing | React Router v6 | Client-side SPA routing |
| Toast Notifications | react-toastify | Success / Error user feedback |
| File Upload | react-dropzone | Drag-and-drop file upload zone |
| Date Picker | react-datepicker | Date input components |
| File Download | file-saver | Client-side Excel/CSV file download |
| HTTP Client | Axios | API communication |
| State Management | React Context API | Authentication context |

### Backend (Server)

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Runtime | Node.js | JavaScript server runtime |
| Framework | Express.js | HTTP routing and middleware |
| Database | MongoDB | NoSQL document database |
| ODM | Mongoose | MongoDB schema modelling |
| Authentication | jsonwebtoken (JWT) | Token-based auth |
| Password Hashing | bcryptjs | Secure password storage (12 salt rounds) |
| File Parsing | ExcelJS | Excel read/write, template generation |
| File Upload | Multer | Multipart form file handling |
| Security | Helmet | HTTP security headers |
| CORS | cors | Cross-origin request handling |
| Sanitization | express-mongo-sanitize | NoSQL injection prevention |
| Rate Limiting | express-rate-limit | API abuse prevention |
| Logging | Morgan | HTTP request logging (dev mode) |
| Cookie Handling | cookie-parser | httpOnly refresh token cookies |
| UUID Generation | uuid | Unique batch IDs for bulk uploads |
| Environment | dotenv | Secure environment variable loading |

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (React/Vite)                    │
│  Port: 5173 (dev)                                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ Auth     │ │Dashboard │ │Training  │ │ Reports  │   │
│  │ Pages    │ │ Pages    │ │ Pages    │ │ Pages    │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │  Staff   │ │  Users   │ │  Bulk    │ │  Audit   │   │
│  │  Pages   │ │  Pages   │ │  Upload  │ │  Logs    │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
└───────────────────────┬──────────────────────────────────┘
                        │ HTTPS / REST API
                        │ Bearer Token (Authorization header)
                        │ httpOnly Cookie (Refresh Token)
┌───────────────────────▼──────────────────────────────────┐
│                    SERVER (Express.js)                    │
│  Port: 5000 (dev)                                        │
│                                                          │
│  Middleware Stack:                                       │
│  Helmet → CORS → JSON Parser → Cookie Parser →          │
│  Mongo Sanitize → Rate Limiter → Routes → Error Handler  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │                    API Routes                     │   │
│  │  /api/v1/auth    /api/v1/users   /api/v1/staff   │   │
│  │  /api/v1/training /api/v1/upload /api/v1/reports │   │
│  │  /api/v1/dashboard /api/v1/master /api/v1/audit  │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Controllers (Business Logic)         │   │
│  │  auth | user | staff | training | upload |       │   │
│  │  dashboard | report | master | audit             │   │
│  └──────────────────────────────────────────────────┘   │
└───────────────────────┬──────────────────────────────────┘
                        │ Mongoose ODM
┌───────────────────────▼──────────────────────────────────┐
│                    MongoDB Database                       │
│                                                          │
│  Collections:                                            │
│  ┌──────────┐ ┌──────────────┐ ┌─────────────────────┐  │
│  │  users   │ │    staff     │ │  trainingrecords    │  │
│  └──────────┘ └──────────────┘ └─────────────────────┘  │
│  ┌──────────┐ ┌──────────────┐ ┌─────────────────────┐  │
│  │ auditlogs│ │ uploadbatches│ │    masterdata       │  │
│  └──────────┘ └──────────────┘ └─────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## 4. User Roles & Permissions

The system has exactly **two roles**: `super_admin` and `admin`. There is **no public-facing user role** — the system is entirely internal/administrative.

### 4.1 Super Admin

The Super Admin is the **highest authority** in the system. There can be a maximum of **1 active Super Admin** at any time. This limit is enforced both during creation and activation.

#### Who is the Super Admin?

The Super Admin is seeded directly into the MongoDB database by running the seeder script (`server/scripts/`). The initial Super Admin is created with the default password `Admin@1234` which must be changed on first login.

#### Super Admin — Full Capabilities

| Module | Capability | Details |
|--------|-----------|---------|
| **Authentication** | Login / Logout | Full access |
| **Authentication** | Change own password | With current password verification |
| **User Management** | View all users | See all admin and super admin accounts |
| **User Management** | Create Admin users | Must provide valid Staff Number + email + temp password |
| **User Management** | Edit any user details | Can change email, role, name |
| **User Management** | Activate / Deactivate users | Cannot deactivate own account |
| **User Management** | Delete (soft delete) users | Cannot delete own account |
| **Staff Management** | Full CRUD on Staff | Add, edit, delete any staff member |
| **Training Records** | Full CRUD on Training | Add, edit, view, delete any training record |
| **Bulk Upload** | Upload training files | Upload Excel/CSV files for batch import |
| **Bulk Upload** | View all upload batches | See history of all imports |
| **Bulk Upload** | Download error reports | Get detailed error spreadsheets |
| **Dashboard** | View all analytics | All KPI cards, all charts |
| **Reports** | Access all 8 report types | Monthly, Quarterly, FY, Staff-wise, Dept-wise, Cost, Status, Beneficiaries |
| **Reports** | Export all reports | Excel, PDF, CSV formats |
| **Master Data** | Full CRUD on master lists | Add/edit/delete/activate designations, groups, divisions, departments |
| **Audit Logs** | View all system audit logs | Filter by action, module, user, date range |
| **Audit Logs** | Filter by any user's UUID | Super Admin can search logs by specific operator |
| **Settings** | Profile settings | View/change own account details |

#### Super Admin — Restrictions

- **Cannot deactivate their own account** (system blocks self-deactivation to prevent lockout)
- **Cannot delete their own account** (system blocks self-deletion)
- **Maximum 1 active Super Admin** at a time; adding more is blocked by the system
- **Cannot bypass password complexity rules** when changing password

#### Super Admin — Special Notes

- When the Super Admin creates a user, the `createdBy` field on the new User document references the Super Admin's ObjectId
- The Super Admin's role cannot be changed while they are active unless limit constraints allow it
- All Super Admin actions are logged in the Audit Log with the Super Admin's email and IP address

---

### 4.2 Admin

The Admin is the **operational user** of the system. There can be a maximum of **6 active Admin users** at any time. Admins are created exclusively by the Super Admin.

#### How Admin Accounts are Created

1. Super Admin navigates to **User Management** → **Add User**
2. Super Admin enters the Admin's **Staff Number** (must exist in Staff Master List), email, and a temporary password
3. The system verifies the Staff Number exists in the Staff collection
4. A new user account is created with `role: 'admin'`
5. On first login with the temporary password, the system flags `mustChangePassword: true` and prompts the Admin to change their password immediately

#### Admin — Full Capabilities

| Module | Capability | Details |
|--------|-----------|---------|
| **Authentication** | Login / Logout | Full access |
| **Authentication** | Change own password | With current password verification |
| **Staff Management** | Full CRUD on Staff | Add, edit, view, delete staff members |
| **Training Records** | Full CRUD on Training | Add, edit, view, delete training records |
| **Bulk Upload** | Upload training files | Upload Excel/CSV files for batch import |
| **Bulk Upload** | View all upload batches | See upload history |
| **Bulk Upload** | Download error reports | Get detailed error spreadsheets |
| **Dashboard** | View all analytics | All KPI cards, all charts |
| **Reports** | Access all 8 report types | All reports with full filter capabilities |
| **Reports** | Export all reports | Excel, PDF, CSV formats |
| **Master Data** | Full CRUD on master lists | Add/edit/delete/activate master values |
| **Settings** | Profile settings | View own account details |

#### Admin — Restrictions

- **Cannot access User Management** — the User List, Add User, Edit User pages are restricted to Super Admin only. If an Admin tries to access these routes, they are redirected to the Access Denied page.
- **Cannot view Audit Logs** — the Audit Log page is restricted to Super Admin only.
- **Cannot create or manage other user accounts** — only Super Admin can do this.
- **Cannot see other users' data** — Admins only see their own profile in Settings.
- **Cannot filter Audit Logs by user UUID** (since they cannot see audit logs at all).

#### Admin — Important Behaviors

- Admin accounts are **soft-deleted** (the `isDeleted` flag is set to `true`; records are not physically removed)
- Admin accounts can be **deactivated** by Super Admin, which prevents login while preserving the record
- If an Admin is deactivated, the system returns a 403 error on their next API call, and subsequent frontend requests are rejected

---

### 4.3 Permission Matrix

| Feature / Page | Super Admin | Admin |
|----------------|-------------|-------|
| Login | ✅ | ✅ |
| Change Password | ✅ | ✅ |
| Dashboard (View) | ✅ | ✅ |
| Staff List | ✅ | ✅ |
| Staff Add | ✅ | ✅ |
| Staff Edit | ✅ | ✅ |
| Staff Delete | ✅ | ✅ |
| Training List | ✅ | ✅ |
| Training Add | ✅ | ✅ |
| Training Edit | ✅ | ✅ |
| Training View | ✅ | ✅ |
| Training Delete | ✅ | ✅ |
| Bulk Upload | ✅ | ✅ |
| Upload History | ✅ | ✅ |
| Upload Batch Detail | ✅ | ✅ |
| Master Data Config | ✅ | ✅ |
| All 8 Reports | ✅ | ✅ |
| Export Reports (Excel/PDF/CSV) | ✅ | ✅ |
| **User List** | ✅ | ❌ |
| **User Add** | ✅ | ❌ |
| **User Edit** | ✅ | ❌ |
| **User Activate/Deactivate** | ✅ | ❌ |
| **User Delete** | ✅ | ❌ |
| **Audit Logs** | ✅ | ❌ |
| **Audit Log by User UUID filter** | ✅ | ❌ |
| Settings (Own profile) | ✅ | ✅ |

---

## 5. Database Models

### 5.1 User Model (`users` collection)

Represents system login accounts (Super Admin and Admin users).

```javascript
{
  staffNumber: String,       // Unique, required, indexed - links to Staff record
  name: String,              // Display name (auto-filled from Staff record)
  email: String,             // Unique, required, lowercase, indexed
  passwordHash: String,      // Bcrypt hash (12 salt rounds)
  role: String,              // Enum: 'super_admin' | 'admin'
  isActive: Boolean,         // Default: true - controls login access
  isDeleted: Boolean,        // Default: false - soft delete flag, indexed
  createdBy: ObjectId,       // Ref: User - who created this account
  updatedBy: ObjectId,       // Ref: User - who last modified this account
  createdAt: Date,           // Auto-timestamp
  updatedAt: Date            // Auto-timestamp
}
```

**Important Indexes**: `staffNumber` (unique), `email` (unique, lowercase), `isDeleted`

**Limits enforced by business logic**:
- Maximum 1 active `super_admin`
- Maximum 6 active `admin` users

---

### 5.2 Staff Model (`staff` collection)

Represents organizational employees. These are NOT login accounts — they are the people who attend training sessions. Every training record is linked to a staff member.

```javascript
{
  staffNumber: String,               // Unique, required, indexed - primary identifier
  staffName: String,                 // Full name, required
  emailId: String,                   // Lowercase, optional
  designation: String,               // Job title (from Master Data)
  groupName: String,                 // Department group (from Master Data)
  productDivisionCategory: String,   // Product division (from Master Data)
  reportingGLManagerName: String,    // Reporting manager name
  employmentStatus: String,          // Enum: 'Currently Serving' | 'Resigned' | 'Retired'
  dateOfJoining: Date,               // Date the staff joined
  superannuationDate: Date,          // Retirement date
  isDeleted: Boolean,                // Default: false - soft delete
  createdBy: ObjectId,               // Ref: User
  updatedBy: ObjectId,               // Ref: User
  createdAt: Date,
  updatedAt: Date
}
```

**Important Indexes**: `staffNumber` (unique), `isDeleted`, `employmentStatus`

**Business Rules**:
- `staffNumber` must be unique and is used as the primary lookup key
- When creating a training record, the system looks up this collection to auto-fill staff details (denormalization)
- Staff records are **never hard-deleted** — soft delete only

---

### 5.3 Training Record Model (`trainingrecords` collection)

The core data model. Each document represents one staff member attending one training session.

```javascript
{
  // ── Staff Info (Denormalized from Staff collection at time of creation) ──
  staffNumber: String,                 // Required, indexed - the trained person
  staffName: String,                   // Copy from Staff
  emailId: String,                     // Copy from Staff
  designation: String,                 // Copy from Staff
  groupName: String,                   // Copy from Staff
  productDivisionCategory: String,     // Copy from Staff
  reportingGLManagerName: String,      // Copy from Staff
  employmentStatus: String,            // Copy from Staff (at time of record creation)
  dateOfJoining: Date,                 // Copy from Staff
  superannuationDate: Date,            // Copy from Staff

  // ── Training Details ──
  trainingTopic: String,               // Required - name of the training course
  trainingModuleNumber: String,        // Required, indexed - alphanumeric module ID
  trainerName: String,                 // Optional - name of the trainer
  trainingInstituteName: String,       // Optional - training organization
  typeOfTraining: String,              // Enum: OT | ILT | Blended | Training for external members | Group specific | Others | -
  trainingMode: String,                // Enum: Online | Offline | Hybrid | Others | -
  trainingDurationHours: Number,       // Required, >= 0
  startDateOfTraining: Date,           // Required, indexed
  endDateOfTraining: Date,             // Required, must be >= startDate
  requestProcessedDate: Date,          // Optional (can be null or '-'), must be >= startDate
  trainingStatus: String,              // Enum: Completed | Not Completed | Scheduled | In Progress | Cancelled | -
  trainingCostPerPerson: Number,       // Default: 0 - cost in INR

  // ── Meta ──
  isDeleted: Boolean,                  // Default: false
  uploadBatchId: String,               // Set if record was created via bulk upload
  createdBy: ObjectId,                 // Ref: User
  updatedBy: ObjectId,                 // Ref: User
  deletedBy: ObjectId,                 // Ref: User
  createdAt: Date,
  updatedAt: Date
}
```

**Compound Unique Index**: `{ staffNumber, trainingModuleNumber, startDateOfTraining }` with `partialFilterExpression: { isDeleted: false }`

This prevents any two active records from having the same staff + module + start date combination. Soft-deleted duplicates are allowed.

---

### 5.4 Audit Log Model (`auditlogs` collection)

Every write action in the system is automatically logged here. The system never allows direct writes to this collection from the frontend.

```javascript
{
  userId: ObjectId,          // Ref: User - who performed the action
  userEmail: String,         // Indexed, lowercase - email of operator
  action: String,            // Enum: CREATE | UPDATE | DELETE | LOGIN | LOGOUT | EXPORT | BULK_UPLOAD
  module: String,            // Which module (Auth | User | Staff | TrainingRecord | UploadBatch | MasterData)
  recordId: ObjectId,        // The MongoDB _id of the affected record
  before: Mixed,             // JSON snapshot of the record BEFORE change
  after: Mixed,              // JSON snapshot of the record AFTER change
  ipAddress: String,         // Client IP address
  timestamp: Date            // Exact time of action (default: Date.now)
}
```

**All Indexed Fields**: `userId`, `userEmail`, `action`, `module`, `recordId`, `timestamp`

**Important Notes**:
- `LOGIN` and `LOGOUT` actions are captured in the auth module
- `BULK_UPLOAD` is logged once when a file is submitted (not once per row)
- For `CREATE` actions: `before` is null, `after` contains the new record
- For `DELETE` actions: `before` contains the old record, `after` shows `isDeleted: true`
- For `UPDATE` actions: both `before` and `after` snapshots are stored
- Passwords are never stored in audit logs — they are replaced with `'SECRET'` or `'UPDATED'`

---

### 5.5 Upload Batch Model (`uploadbatches` collection)

Tracks the status and results of each bulk file import.

```javascript
{
  batchId: String,           // UUID v4 - unique identifier
  fileName: String,          // Original uploaded file name
  uploadedBy: ObjectId,      // Ref: User
  status: String,            // Enum: processing | completed | failed
  totalRows: Number,         // Total rows in the uploaded file
  successCount: Number,      // Rows successfully inserted
  errorCount: Number,        // Rows that failed validation
  duplicateCount: Number,    // Rows skipped as duplicates
  errors: Array,             // [ { row: Number, reason: String, data: Object } ]
  duplicates: Array,         // [ { row: Number, reason: String, data: Object } ]
  createdAt: Date,
  updatedAt: Date
}
```

---

### 5.6 Master Data Model (`masterdata` collection)

Stores the configurable dropdown values for forms throughout the system.

```javascript
{
  type: String,              // 'designation' | 'groupName' | 'productDivision' | 'department'
  value: String,             // The display text (e.g., "Sales Manager", "IT Group")
  isActive: Boolean,         // Controls visibility in dropdown forms
  createdBy: ObjectId,       // Ref: User
  updatedBy: ObjectId        // Ref: User
}
```

---

## 6. Authentication & Security

### 6.1 JWT Authentication Flow

```
User Submits Login Form
        │
        ▼
POST /api/v1/auth/login
        │
        ├─ Verify email + password (bcrypt compare)
        ├─ Check isActive and isDeleted flags
        ├─ Generate Access Token (JWT, 8h expiry)
        ├─ Generate Refresh Token (JWT, 7d expiry)
        ├─ Store Refresh Token in httpOnly Cookie
        ├─ Log LOGIN action in Audit Logs
        │
        ▼
Return: { token: accessToken, user: { id, name, email, role, mustChangePassword } }
        │
        ▼
Frontend stores accessToken in memory / localStorage
        │
        ▼
Every API Request → Authorization: Bearer <accessToken>
        │
        ▼
auth.js middleware:
        ├─ Extract Bearer token
        ├─ Verify JWT signature with JWT_SECRET
        ├─ Load user from DB (excluding passwordHash)
        ├─ Check isActive and isDeleted
        ├─ Attach user to req.user
        │
        ▼
roleCheck.js middleware (for restricted routes):
        ├─ Check req.user.role against allowed roles array
        └─ Return 403 if insufficient permissions
```

### 6.2 Token Refresh Flow

When the access token expires (after 8 hours), the frontend can silently obtain a new access token using the refresh token stored in the httpOnly cookie:

```
Frontend detects 401 response
        │
        ▼
POST /api/v1/auth/refresh (sends httpOnly cookie automatically)
        │
        ├─ Verify refreshToken from cookie using JWT_REFRESH_SECRET
        ├─ Load user, check isActive and isDeleted
        ├─ Generate new access token
        │
        ▼
Return: { token: newAccessToken }
```

### 6.3 Password Security

- Passwords are hashed with **bcrypt** using **12 salt rounds** (computationally expensive, resistant to brute-force)
- **Password complexity requirements**: minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 digit, 1 special character (`@$!%*?&`)
- **Default password**: `Admin@1234` (used for seeded accounts, flagged as `mustChangePassword: true` on first login)
- Passwords are **never** returned in API responses or stored in Audit Logs

### 6.4 Security Middleware Stack

| Middleware | Purpose |
|-----------|---------|
| `helmet()` | Sets secure HTTP headers (XSS protection, content-type sniffing, etc.) |
| `cors()` | Allows requests only from the configured FRONTEND_URL |
| `express-mongo-sanitize()` | Strips MongoDB operators (`$`, `.`) from user input to prevent NoSQL injection |
| `rateLimiter` | Limits requests to `/api/` to prevent brute-force and DoS attacks |
| `cookieParser()` | Parses the httpOnly refresh token cookie |

---

## 7. Complete Page-by-Page Breakdown

### 7.1 Login Page

**Route**: `/login` (Public — no auth required)

**File**: `client/src/pages/auth/LoginPage.jsx`

#### Purpose
The entry point for all users. Handles credential validation and establishes an authenticated session.

#### How It Works
1. User enters their **email address** and **password**
2. On submission, the form calls `POST /api/v1/auth/login`
3. The server verifies:
   - Email exists in the database
   - Password matches the bcrypt hash
   - Account is active (`isActive: true`)
   - Account is not deleted (`isDeleted: false`)
4. On success, the server returns an access token and user profile data
5. If `mustChangePassword` is `true` (default password detected), the user is automatically redirected to `/change-password`
6. Otherwise, the user is redirected to `/dashboard`

#### Key Features
- **Email/Password validation** before API call
- **Error display** for wrong credentials or deactivated accounts
- **Loading state** during API call
- **Remember session**: access token is stored and used for all subsequent requests

#### What Happens After Login
- The JWT access token (8-hour validity) is stored in the Auth Context
- A refresh token (7-day validity) is set as an httpOnly cookie by the server
- The user's role determines which navigation items are visible in the sidebar
- `LOGIN` action is recorded in the Audit Log

---

### 7.2 Change Password Page

**Route**: `/change-password` (Private)

**File**: `client/src/pages/auth/ChangePasswordPage.jsx`

#### Purpose
Allows any authenticated user (both Super Admin and Admin) to change their own account password.

#### How It Works
1. User enters **Current Password**, **New Password**, and **Confirm New Password**
2. Client-side validation checks that new password matches confirm field
3. Calls `POST /api/v1/auth/change-password`
4. Server validates:
   - Current password matches stored hash (bcrypt compare)
   - New password meets complexity rules
   - New password is different from current password
5. On success, the password hash is updated in the database
6. `UPDATE` action is logged in Audit Log with masked password values

#### Key Features
- **Forced redirect** from Login page when `mustChangePassword: true`
- **Password visibility toggle** for each field
- **Real-time complexity feedback**
- Password complexity: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char (`@$!%*?&`)

---

### 7.3 Dashboard Page

**Route**: `/dashboard` (Private — both roles)

**File**: `client/src/pages/dashboard/DashboardPage.jsx`

#### Purpose
The main analytics and KPI overview page. Provides at-a-glance insights into training program performance.

#### How It Works
On page load, the dashboard makes **8 parallel API calls** to fetch all analytics data simultaneously. All calls accept the same filter parameters (Financial Year, Group, Division).

#### Filter Controls (Top Right)
| Filter | Options | Effect |
|--------|---------|--------|
| Financial Year | FY 2024-25, FY 2025-26, FY 2026-27 | Filters all charts to that April–March period |
| Group | All + dynamic list from Master Data | Filters by organizational group |
| Division | All + dynamic list from Master Data | Filters by product division |

#### KPI Summary Cards (6 Cards)
| Card | Metric | Calculation |
|------|--------|-------------|
| Records | Total training log count | Count of TrainingRecord documents |
| Trained | Unique staff who attended any training | Count of unique `staffNumber` values |
| Hours | Total training hours | Sum of `trainingDurationHours` |
| Cost | Total financial spend | Sum of `trainingCostPerPerson` in INR |
| Coverage | Training coverage % | (Unique Staff Trained ÷ Total Active Staff) × 100 |
| Completed | Total beneficiaries | Count where `trainingStatus = 'Completed'` |

#### Charts (5 Visualization Panels)

1. **Monthly Trainings Trend** (Bar Chart - 2/3 width)
   - X-axis: Month names (April → March for Indian FY)
   - Two bars per month: Training Count + Duration Hours
   - Sorted by financial year order (April first)

2. **Training Status Breakdown** (Donut Pie Chart - 1/3 width)
   - Slices: Completed (Green), Not Completed (Red), Cancelled (Grey)
   - Shows proportional distribution of training outcomes

3. **Cost by Training Type** (Horizontal Bar Chart - 1/3 width)
   - Y-axis: Training types (OT, ILT, External, etc.)
   - X-axis: Total cost in INR
   - Useful for budget analysis by training category

4. **Training Coverage % by Group** (Bar Chart - 2/3 width)
   - X-axis: Organizational group names
   - Y-axis: Coverage percentage (0-100%)
   - Shows which groups have the best/worst training participation

5. **Top Training Topics** (Progress Bar List - 1/3 width)
   - Top 5 topics shown with horizontal progress bars
   - Ranked by number of attendees

#### Key Features
- All charts re-render automatically when filters change
- Loading spinner shown during data fetch
- Error toast if any API call fails
- Responsive grid layout (1 column mobile, 3 columns desktop)

---

### 7.4 Staff List Page

**Route**: `/staff` (Private — both roles)

**File**: `client/src/pages/staff/StaffListPage.jsx`

#### Purpose
View and manage all staff members in the organizational master list.

#### How It Works
Fetches paginated staff records from `GET /api/v1/staff`. Supports search and filtering.

#### Filters Available
| Filter | Type | Description |
|--------|------|-------------|
| Search | Text input | Searches staffName, staffNumber, emailId (case-insensitive regex) |
| Employment Status | Dropdown | Currently Serving / Resigned / Retired |
| Group Name | Dropdown | Filter by organizational group |
| Designation | Dropdown | Filter by job title |

#### Columns Displayed
- Staff Number
- Staff Name
- Email
- Designation
- Group Name
- Employment Status (color-coded badge)
- Date of Joining
- Action buttons (Edit, Delete)

#### Key Features
- **Pagination**: configurable rows per page (10, 25, 50, 100)
- **Soft Delete**: Deleting a staff member sets `isDeleted: true` — data is never permanently removed
- **Confirmation Dialog**: Delete action requires confirmation before proceeding
- **Quick Search**: Real-time text search across name, number, email
- **Status Badge**: Color-coded employment status (green = Currently Serving, orange = Resigned, red = Retired)
- **Add Button**: Top-right button navigates to Staff Add page

---

### 7.5 Staff Add Page

**Route**: `/staff/add` (Private — both roles)

**File**: `client/src/pages/staff/StaffAddPage.jsx`

#### Purpose
Register a new staff member (employee) in the system master list.

#### Form Fields

| Field | Required | Type | Notes |
|-------|---------|------|-------|
| Staff Number | ✅ | Text | Must be unique across all staff |
| Staff Name | ✅ | Text | Full display name |
| Email ID | ❌ | Email | Auto-lowercased |
| Designation | ❌ | Dropdown | Values from Master Data: Designations |
| Group Name | ❌ | Dropdown | Values from Master Data: Group Names |
| Product Division Category | ❌ | Dropdown | Values from Master Data: Product Divisions |
| Reporting GL Manager Name | ❌ | Text | Manager's name |
| Employment Status | ✅ | Dropdown | Currently Serving / Resigned / Retired |
| Date of Joining | ❌ | Date | When the employee joined |
| Superannuation Date | ❌ | Date | Planned retirement date |

#### How It Works
1. Admin fills in the form
2. Client-side validation checks required fields
3. Calls `POST /api/v1/staff`
4. Server checks:
   - Staff Number uniqueness (rejects if duplicate)
   - Required field presence
5. On success, navigates back to Staff List
6. `CREATE` action logged in Audit Log

#### Key Features
- Dropdown options loaded dynamically from Master Data collection
- Duplicate Staff Number detection with user-friendly error message
- Date pickers for joining/superannuation dates

---

### 7.6 Staff Edit Page

**Route**: `/staff/:id/edit` (Private — both roles)

**File**: `client/src/pages/staff/StaffEditPage.jsx`

#### Purpose
Modify an existing staff member's details. Staff Number cannot be changed after creation.

#### How It Works
1. Page loads and fetches staff data via `GET /api/v1/staff/:id`
2. Form is pre-populated with existing values
3. On save, calls `PUT /api/v1/staff/:id`
4. Only the fields that are editable can be changed (staffNumber is read-only)
5. `UPDATE` action logged in Audit Log with before/after snapshots

**Note**: When a staff member's details (name, designation, group, etc.) are updated in the Staff collection, **existing training records are NOT automatically updated** — the training records contain a denormalized snapshot from the time the record was created. This is by design for historical accuracy.

---

### 7.7 Training List Page

**Route**: `/training` (Private — both roles)

**File**: `client/src/pages/training/TrainingListPage.jsx`

#### Purpose
The primary listing and search page for all training records. The most data-dense page in the system.

#### Filters Available
| Filter | Type | Description |
|--------|------|-------------|
| Search | Text | Search staffName, staffNumber, trainingTopic |
| Staff Number | Lookup | Exact staff number filter |
| Start Date | Date | Filter by training start date (from) |
| End Date | Date | Filter by training start date (to) |
| Training Type | Dropdown | OT, ILT, Blended, External, Group, Others |
| Training Mode | Dropdown | Online, Offline, Hybrid, Others |
| Training Status | Dropdown | Completed, Not Completed, Scheduled, In Progress, Cancelled |
| Group | Dropdown | Organizational group filter |
| Division | Dropdown | Product division filter |
| Financial Year | Dropdown | FY filter (April → March) |
| Quarter | Dropdown | Q1 (Apr-Jun), Q2 (Jul-Sep), Q3 (Oct-Dec), Q4 (Jan-Mar) |
| Month | Dropdown | Specific month filter |

#### Columns Displayed
- Staff Number + Staff Name
- Training Topic
- Module Number
- Type (color-coded badge)
- Mode (color-coded badge)
- Duration (Hours)
- Start Date
- End Date
- Status (color-coded badge)
- Cost Per Person (INR)
- Actions (View, Edit, Delete)

#### Key Features
- **Advanced multi-filter system** with 13 different filter options
- **Pagination** with configurable page size
- **Compound date filtering**: Financial Year overrides individual date range when specified
- **Indian Fiscal Year support**: FY starts April 1 and ends March 31
- **Quarter logic**: Q1=Apr-Jun, Q2=Jul-Sep, Q3=Oct-Dec, Q4=Jan-Mar
- **Soft delete confirmation** with impact notice
- **Sort**: Default sort by startDateOfTraining descending (newest first)

---

### 7.8 Training Add Page

**Route**: `/training/add` (Private — both roles)

**File**: `client/src/pages/training/TrainingAddPage.jsx`

#### Purpose
Add a new individual training record for a staff member.

#### Form Fields

| Field | Required | Type | Validation |
|-------|---------|------|-----------|
| Staff Number | ✅ | Autocomplete | Must exist in Staff Master List |
| Training Topic | ✅ | Text | |
| Training Module Number | ✅ | Text | Alphanumeric, dashes, underscores only |
| Trainer Name | ❌ | Text | |
| Training Institute Name | ❌ | Text | |
| Type of Training | ✅ | Dropdown | OT / ILT / Blended / External / Group / Others / - |
| Training Mode | ✅ | Dropdown | Online / Offline / Hybrid / Others / - |
| Training Duration Hours | ✅ | Number | Must be >= 0 |
| Start Date of Training | ✅ | Date | |
| End Date of Training | ✅ | Date | Must be >= Start Date |
| Request Processed Date | ✅ | Date or "-" | Must be >= Start Date, or literal "-" |
| Training Status | ✅ | Dropdown | Completed / Not Completed / Scheduled / In Progress / Cancelled / - |
| Training Cost Per Person | ❌ | Number | Defaults to 0 (INR) |

#### Staff Autocomplete Feature
- As the user types a staff number or name, the system sends a search request to `GET /api/v1/staff/search?q=...`
- The dropdown shows matching staff members
- When a staff member is selected, **read-only fields are auto-filled**:
  - Staff Name, Email, Designation, Group Name, Division, Reporting Manager, Employment Status

#### Duplicate Detection
- Before submission, or during form entry, the system checks for duplicate records
- A duplicate is defined as: same `staffNumber` + same `trainingModuleNumber` + same `startDateOfTraining`
- If a duplicate is detected, the form shows an error and blocks submission

#### How It Works
1. User searches for and selects a staff member
2. Staff details auto-populate read-only fields
3. User fills in training details
4. Client validates required fields and logical date order
5. Server performs:
   - Staff existence check
   - Module number format validation
   - Date logical order validation
   - Compound duplicate check
6. On success: `CREATE` action logged in Audit Log

---

### 7.9 Training Edit Page

**Route**: `/training/:id/edit` (Private — both roles)

**File**: `client/src/pages/training/TrainingEditPage.jsx`

#### Purpose
Edit an existing training record. Staff details (staffNumber, staffName, etc.) are **read-only** once a record is created — only the training-specific fields can be edited.

#### Editable Fields
- Training Topic, Module Number, Trainer Name, Training Institute Name
- Type of Training, Training Mode, Duration Hours
- Start Date, End Date, Request Processed Date
- Training Status, Cost Per Person

#### Read-Only Fields (cannot be changed)
- Staff Number, Staff Name, Email, Designation, Group Name, Division, Employment Status

#### Validation on Edit
- Duplicate check excludes the current record's ID (allows saving without changes)
- Date order validation applied the same as Add
- `UPDATE` action logged in Audit Log with before/after JSON snapshots

---

### 7.10 Training View Page

**Route**: `/training/:id` (Private — both roles)

**File**: `client/src/pages/training/TrainingViewPage.jsx`

#### Purpose
Read-only display of a complete training record with all details.

#### Information Displayed
- **Staff Section**: Staff Number, Name, Email, Designation, Group, Division, Manager, Employment Status, Date of Joining, Superannuation Date
- **Training Section**: Topic, Module Number, Trainer Name, Institution, Type, Mode, Duration, Start Date, End Date, Processed Date, Status, Cost
- **System Section**: Created By, Created At, Updated By, Updated At, Upload Batch ID (if imported via bulk upload)

#### Key Features
- Clearly labeled section groups
- Date formatting to Indian locale
- Cost formatted as INR currency
- Quick actions (Edit, Delete) available at the top
- Breadcrumb navigation back to Training List

---

### 7.11 User List Page (Super Admin Only)

**Route**: `/users` (Private — Super Admin only)

**File**: `client/src/pages/users/UserListPage.jsx`

#### Purpose
Super Admin's control panel for managing all system accounts (both Super Admin and Admin accounts).

#### Access Control
- If an Admin user navigates to this URL, they are redirected to the **Access Denied** page
- Route is protected via both frontend route guard and backend `authorize('super_admin')` middleware

#### Filters Available
| Filter | Options |
|--------|---------|
| Role | All / super_admin / admin |
| Status | All / Active / Inactive |
| Search | Name, email, staff number |

#### Columns Displayed
- Staff Number
- Name
- Email
- Role (badge)
- Status (Active/Inactive badge)
- Created At
- Action buttons (Edit, Activate/Deactivate, Delete)

#### Key Features
- **Activate Button**: Activates a deactivated account (subject to count limits)
- **Deactivate Button**: Deactivates an active account; Super Admin cannot deactivate themselves
- **Delete Button**: Soft-deletes the account; Super Admin cannot delete themselves
- **Count limits enforced**: Cannot activate an admin if 6 are already active; cannot activate super_admin if 1 is already active
- Confirmation dialog for destructive actions

---

### 7.12 User Add Page (Super Admin Only)

**Route**: `/users/add` (Private — Super Admin only)

**File**: `client/src/pages/users/UserAddPage.jsx`

#### Purpose
Create a new Admin (or Super Admin) system account.

#### Form Fields

| Field | Required | Notes |
|-------|---------|-------|
| Staff Number | ✅ | Must exist in Staff Master List; auto-fetches name |
| Email | ✅ | Must be unique in Users collection |
| Role | ✅ | super_admin or admin |
| Temporary Password | ✅ | Will be given to the user; they must change it on first login |

#### Business Logic
1. Super Admin enters a Staff Number
2. System looks up Staff collection to verify the staff member exists
3. System auto-fills the Name from the Staff record
4. Super Admin assigns the Role and sets a temporary password
5. Server enforces count limits:
   - If `super_admin` role selected and 1 already active → rejected
   - If `admin` role selected and 6 already active → rejected
6. Password is hashed with bcrypt (12 rounds)
7. `CREATE` action logged in Audit Log

---

### 7.13 User Edit Page (Super Admin Only)

**Route**: `/users/:id/edit` (Private — Super Admin only)

**File**: `client/src/pages/users/UserEditPage.jsx`

#### Purpose
Modify an existing system user's details (name, email, role).

#### Editable Fields
- Email, Display Name, Role

#### Read-Only Fields
- Staff Number (cannot be changed)

#### Business Logic
- If changing the role changes the count of active super_admins or admins, limits are enforced
- `UPDATE` action logged in Audit Log

---

### 7.14 Bulk Upload Page

**Route**: `/bulk-upload` (Private — both roles)

**File**: `client/src/pages/bulk-upload/BulkUploadPage.jsx`

#### Purpose
Import hundreds or thousands of training records at once using an Excel or CSV spreadsheet. This is the primary data ingestion method for large training programs.

#### The 3-Step Wizard

**Step 1: Download Import Template**
- Users download an official template (`.xlsx` or `.csv`) from the system
- The Excel template has two sheets:
  1. **Template** sheet: Headers row + one sample data row
  2. **Instructions** sheet: Field-by-field guide with required/optional status, allowed values, and format notes
- Headers are styled with dark blue background and white text
- Column widths are pre-set to 24 units for readability

**Step 2: Drop and Select File**
- User drags the filled file into the dropzone OR clicks to browse
- Accepts `.xlsx`, `.xls`, `.csv` files up to **10MB**
- Only 1 file at a time
- Shows selected file name and size
- **Start Validation** button submits the file

**Step 3: Process & View Results**
- File is uploaded to server via `POST /api/v1/upload/training` (multipart/form-data)
- Server creates an UploadBatch record with `status: 'processing'`
- **Asynchronous processing**: The server immediately returns a `202 Accepted` response with the `batchId`; the actual row parsing happens in the background
- Frontend **polls every 2 seconds** via `GET /api/v1/upload/batches/:batchId` until `status` is `'completed'` or `'failed'`
- A live progress bar updates as rows are processed

#### Results Summary (after processing)
| Metric Card | Description |
|-------------|-------------|
| Total Rows | Number of data rows in the file |
| Inserted Successfully | Rows that were validated and saved |
| Duplicate Duplicates | Rows skipped because they matched an existing record |
| Validation Errors | Rows that failed validation (missing fields, wrong format, staff not found, etc.) |

#### Inline Error Tables (within the page)
- **Validation Failure Rows**: Shows row number, reason, and raw data fragment for each failed row
- **Duplicate Skipping Rows**: Shows row number, duplicate reason, and original data

#### Download Error Report
- A button appears if any errors or duplicates exist
- Downloads an Excel file with 2 sheets:
  1. **Validation Errors** sheet (red header): Row #, Error Reason, Original Data
  2. **Duplicate Rows** sheet (orange header): Row #, Duplicate Reason, Original Data

#### Bulk Upload Field Requirements

| Column | Required | Allowed Values / Format |
|--------|---------|------------------------|
| Staff Number | ✅ | Must exist in Staff Master List |
| Training Topic | ✅ | Any text |
| Training Module Number | ✅ | Alphanumeric + dashes/underscores |
| Trainer Name | ❌ | Any text |
| Training Institute Name | ❌ | Any text |
| Type of Training | ✅ | OT / Training for external members / Group specific / Others |
| Training Mode | ✅ | Online / Offline / Others |
| Training Duration Hours | ✅ | Decimal number >= 0.5 |
| Start Date | ✅ | DD/MM/YYYY or YYYY-MM-DD |
| End Date | ✅ | DD/MM/YYYY or YYYY-MM-DD, must be >= Start Date |
| Request Processed Date | ✅ | DD/MM/YYYY or YYYY-MM-DD (must be >= Start Date), OR literal "-" |
| Training Status | ✅ | Completed / Not Completed / Cancelled |
| Training Cost Per Person | ❌ | Number (defaults to 0 if missing) |

#### Key Features
- Upload History button → navigates to batch list page
- Drag-and-drop file zone with animated bounce indicator
- Real-time polling with 2-second interval
- Automatic cleanup of polling interval on page unmount
- "Upload Another File" button to restart the wizard
- "View All Records" link to Training List page after successful upload

---

### 7.15 Upload Batch List Page

**Route**: `/bulk-upload/history` (Private — both roles)

**File**: `client/src/pages/bulk-upload/UploadBatchListPage.jsx`

#### Purpose
Historical log of all previous bulk upload operations.

#### Columns Displayed
- Batch ID (UUID)
- File Name
- Uploaded By (user name/email)
- Status (Processing / Completed / Failed badge)
- Total Rows / Success / Errors / Duplicates
- Upload Date/Time
- View Details button

---

### 7.16 Upload Batch Detail Page

**Route**: `/bulk-upload/history/:batchId` (Private — both roles)

**File**: `client/src/pages/bulk-upload/UploadBatchDetailPage.jsx`

#### Purpose
Detailed view of a specific upload batch — useful for investigating past imports.

#### Information Displayed
- All batch metadata (file name, uploaded by, timestamps, status)
- Summary counts (total, success, errors, duplicates)
- Full error table with row numbers and reasons
- Full duplicate table
- Download Error Report button

---

### 7.17 Master Data Configuration Page

**Route**: `/master` (Private — both roles)

**File**: `client/src/pages/master/MasterDataPage.jsx`

#### Purpose
Administrative control panel for managing the dropdown option values used throughout forms. This allows admins to add new designations, groups, divisions, and departments without any code changes.

#### Four Configurable Categories (Tabs)

| Tab | What it controls |
|-----|-----------------|
| **Designations** | Job title options in Staff form and filters |
| **Group Names** | Organizational group options in Staff form, Training form, and all filters |
| **Product Divisions** | Division options in Staff form, Training form, and all filters |
| **Departments** | Department options (for internal categorization) |

#### Operations Available per Category

| Action | Description |
|--------|-------------|
| **Add Option** | Opens modal, user types a new value text, saves to DB |
| **Edit** (pencil icon) | Opens same modal pre-populated, user edits value text |
| **Toggle Active/Inactive** (power icon) | Toggles `isActive` flag; inactive values disappear from form dropdowns |
| **Delete** (trash icon) | Soft-deletes the value after confirmation |

#### How Activation/Deactivation Works
- When a value is `isActive: false`, it still appears in this management page with "Inactive" badge
- It does **not** appear in frontend form dropdown options for staff/training records
- This allows values to be "retired" without deleting them from history

#### Key Features
- Tab switching reloads data for the selected category
- Inline confirm dialog before deletion
- Success/error toast notifications
- Loading spinner during data fetch

---

### 7.18 Reports Pages

All reports are under the `/reports/` route prefix. Each report page has **consistent filter panels** and **export functionality** (Excel, PDF, CSV). Both Super Admin and Admin have full access to all reports.

#### Common Filter Options (Most Reports)
- Financial Year (April → March)
- Quarter (Q1–Q4)
- Month (1–12)
- Group Name (multi-select)
- Product Division (multi-select)
- Training Type (multi-select)
- Training Mode (multi-select)
- Training Status (multi-select)
- Staff Number (individual lookup)

#### Export Formats Available
- **Excel (.xlsx)**: Styled spreadsheet with colored headers
- **PDF**: Tabular PDF report
- **CSV**: Raw comma-separated data

---

**7.18.1 Monthly Report**

**Route**: `/reports/monthly`
**File**: `client/src/pages/reports/MonthlyReportPage.jsx`
**API**: `GET /api/v1/reports/monthly`

| Column | Description |
|--------|-------------|
| Month | Calendar month name |
| Total Trainings | Count of training records that month |
| Unique Staff | Count of distinct staff who trained |
| Training Hours | Sum of duration hours |
| Total Cost | Sum of cost per person (INR) |
| Coverage % | (Unique Staff ÷ Total Active Staff) × 100 |
| By Type breakdown | OT / External / Group / Others counts |

Sorted by Indian Financial Year order (April first). Shows all 12 months even if some have zero records.

---

**7.18.2 Quarterly Report**

**Route**: `/reports/quarterly`
**File**: `client/src/pages/reports/QuarterlyReportPage.jsx`
**API**: `GET /api/v1/reports/quarterly`

| Quarter | Months |
|---------|--------|
| Q1 | April, May, June |
| Q2 | July, August, September |
| Q3 | October, November, December |
| Q4 | January, February, March |

Same columns as Monthly Report but aggregated by quarter.

---

**7.18.3 Financial Year Report**

**Route**: `/reports/financial-year`
**File**: `client/src/pages/reports/FinancialYearReportPage.jsx`
**API**: `GET /api/v1/reports/financial-year`

Shows a year-over-year comparison of training activities across multiple financial years. Useful for trend analysis. Records are programmatically grouped by their start date's FY.

---

**7.18.4 Staff-Wise Report**

**Route**: `/reports/staff-wise`
**File**: `client/src/pages/reports/StaffWiseReportPage.jsx`
**API**: `GET /api/v1/reports/staff-wise`

| Column | Description |
|--------|-------------|
| Staff Number | Employee ID |
| Staff Name | Full name |
| Designation | Job title |
| Group Name | Department group |
| Total Trainings | Total records for this staff |
| Total Hours | Sum of all training hours |
| Total Cost | Sum of all costs |
| Status Breakdown | Completed / Not Completed / Cancelled counts |

Sorted by `totalTrainings` descending. This report can also filter by a specific staff number for an individual training history.

---

**7.18.5 Department-Wise Report**

**Route**: `/reports/department-wise`
**File**: `client/src/pages/reports/DepartmentWiseReportPage.jsx`
**API**: `GET /api/v1/reports/department-wise`

| Column | Description |
|--------|-------------|
| Group Name | Organizational group |
| Total Staff | Active staff in this group |
| Staff Trained | Unique staff who attended training |
| Coverage % | Trained ÷ Total × 100 |
| Total Hours | Sum of training hours |
| Total Cost | Sum of costs |
| By Type breakdown | OT / External / Group / Others |

---

**7.18.6 Cost Analysis Report**

**Route**: `/reports/cost-analysis`
**File**: `client/src/pages/reports/CostAnalysisReportPage.jsx`
**API**: `GET /api/v1/reports/cost-analysis`

| Column | Description |
|--------|-------------|
| Training Type | OT / ILT / External / Group / Others |
| Total Trainings | Count of records |
| Beneficiaries | Count where status = Completed |
| Total Cost | Sum of cost per person |
| Avg Cost Per Person | Total Cost ÷ Beneficiaries |

---

**7.18.7 Training Status Report**

**Route**: `/reports/training-status`
**File**: `client/src/pages/reports/TrainingStatusReportPage.jsx`
**API**: `GET /api/v1/reports/training-status`

| Column | Description |
|--------|-------------|
| Status | Completed / Not Completed / Cancelled |
| Count | Number of records with this status |
| % of Total | Proportion of all records |
| Training Hours | Hours associated with this status |
| Cost | Cost associated with this status |

---

**7.18.8 Beneficiary Report**

**Route**: `/reports/beneficiaries`
**File**: `client/src/pages/reports/BeneficiaryReportPage.jsx`
**API**: `GET /api/v1/reports/beneficiaries`

Groups records by training module (topic + module number) and counts beneficiaries (staff who Completed).

| Column | Description |
|--------|-------------|
| Training Topic | Course name |
| Module Number | Module identifier |
| Type | Training type |
| Beneficiary Count | Count where status = Completed |
| Total Hours | Sum of hours |
| Total Cost | Sum of costs |

Sorted by Beneficiary Count descending — highest impact training programs at top.

---

### 7.19 Audit Log Page (Super Admin Only)

**Route**: `/audit` (Private — Super Admin only)

**File**: `client/src/pages/audit/AuditLogPage.jsx`

#### Purpose
Complete chronological record of every write action performed in the system. The Super Admin can investigate who did what, when, and from which IP address.

#### Access Control
- Strictly Super Admin only (both frontend route guard and backend middleware)
- Admin users cannot see this page

#### Filters Available
| Filter | Options |
|--------|---------|
| Action | CREATE / UPDATE / DELETE / LOGIN / LOGOUT / EXPORT / BULK_UPLOAD |
| Module | Auth / User / Staff / TrainingRecord / UploadBatch / MasterData |
| Operator User UUID | (Super Admin only) filter by specific user's ID |
| Start Date | From date |
| End Date | To date |

#### Columns Displayed
| Column | Description |
|--------|-------------|
| Timestamp | Exact date and time of action (Indian locale format) |
| Operator | Email + User ID of who performed the action |
| Action | Color-coded badge (CREATE=Green, DELETE=Red, UPDATE=Amber, LOGIN=Blue, BULK_UPLOAD=Purple) |
| Module | Which module was affected |
| Affected Record ID | MongoDB ObjectId of the changed record |
| IP Address | Client IP address at time of action |
| Compare (button) | Opens JSON diff modal |

#### JSON Diff Modal (Compare)
- Clicking **Compare** on any row opens a side-by-side modal
- **Left side (Before)**: JSON snapshot of the record before the change
- **Right side (After)**: JSON snapshot of the record after the change
- For CREATE actions: Before shows "No prior state"
- For DELETE actions: After shows `isDeleted: true`
- This allows precise auditing of exactly what data changed

#### Pagination
- Default 25 rows per page
- Configurable (10, 25, 50, 100)

#### Key Features
- Complete non-repudiation trail — every write action is immutably logged
- IP address tracking for security incident investigation
- Action color coding for quick visual scanning
- Before/after JSON diff for precise change tracking

---

### 7.20 Settings Page

**Route**: `/settings` (Private — both roles)

**File**: `client/src/pages/settings/SettingsPage.jsx`

#### Purpose
Allows users to view their own account profile and access account-related actions.

#### Information Displayed
- Staff Number
- Display Name
- Email Address
- Role (badge)
- Account Status (Active/Inactive)
- Account Created Date

#### Available Actions
- **Change Password** button → links to Change Password page
- Profile display (read-only)

---

## 8. API Routes Reference

### Authentication Routes (`/api/v1/auth`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/login` | Public | Login with email + password |
| POST | `/logout` | Private | Logout and clear refresh cookie |
| POST | `/change-password` | Private | Change own password |
| GET | `/me` | Private | Get current user profile |
| POST | `/refresh` | Public (cookie) | Get new access token using refresh cookie |

### User Routes (`/api/v1/users`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Super Admin | List all users (paginated, filtered) |
| POST | `/` | Super Admin | Create new user |
| GET | `/:id` | Super Admin | Get single user by ID |
| PUT | `/:id` | Super Admin | Update user details |
| PATCH | `/:id/activate` | Super Admin | Activate user |
| PATCH | `/:id/deactivate` | Super Admin | Deactivate user |
| DELETE | `/:id` | Super Admin | Soft-delete user |

### Staff Routes (`/api/v1/staff`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Both Roles | List all staff (paginated, filtered) |
| POST | `/` | Both Roles | Create new staff member |
| GET | `/search` | Both Roles | Autocomplete search (q= param) |
| GET | `/:id` | Both Roles | Get single staff member |
| PUT | `/:id` | Both Roles | Update staff member |
| DELETE | `/:id` | Both Roles | Soft-delete staff member |

### Training Routes (`/api/v1/training`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Both Roles | List training records (paginated, 13 filters) |
| POST | `/` | Both Roles | Create training record |
| GET | `/check-duplicate` | Both Roles | Pre-check for duplicate before save |
| GET | `/:id` | Both Roles | Get single training record |
| PUT | `/:id` | Both Roles | Update training record |
| DELETE | `/:id` | Both Roles | Soft-delete training record |

### Upload Routes (`/api/v1/upload`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/training` | Both Roles | Upload Excel/CSV file for bulk import |
| GET | `/template` | Both Roles | Download import template (xlsx or csv) |
| GET | `/batches` | Both Roles | List all upload batches |
| GET | `/batches/:batchId` | Both Roles | Get batch details and row results |
| GET | `/batches/:batchId/error-report` | Both Roles | Download error Excel report |

### Dashboard Routes (`/api/v1/dashboard`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/summary` | Both Roles | KPI summary (6 metric cards) |
| GET | `/by-month` | Both Roles | Monthly training count and hours |
| GET | `/by-status` | Both Roles | Status distribution (pie chart data) |
| GET | `/by-type` | Both Roles | Type distribution |
| GET | `/by-mode` | Both Roles | Mode distribution |
| GET | `/top-trainings` | Both Roles | Top 10 training topics by attendance |
| GET | `/cost-by-type` | Both Roles | Cost breakdown by training type |
| GET | `/coverage-by-group` | Both Roles | Coverage % per organizational group |
| GET | `/coverage-by-division` | Both Roles | Coverage % per product division |

### Report Routes (`/api/v1/reports`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/monthly` | Both Roles | Month-by-month report |
| GET | `/quarterly` | Both Roles | Q1-Q4 quarterly report |
| GET | `/financial-year` | Both Roles | Year-over-year FY comparison |
| GET | `/staff-wise` | Both Roles | Per-staff training history |
| GET | `/department-wise` | Both Roles | Per-group training coverage |
| GET | `/cost-analysis` | Both Roles | Cost breakdown by training type |
| GET | `/training-status` | Both Roles | Status distribution report |
| GET | `/beneficiaries` | Both Roles | Beneficiaries per training module |
| POST | `/export` | Both Roles | Export any report (Excel/PDF/CSV) |

### Master Data Routes (`/api/v1/master`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Both Roles | Get master data by type |
| POST | `/` | Both Roles | Add new master value |
| PUT | `/:id` | Both Roles | Update master value |
| DELETE | `/:id` | Both Roles | Delete master value |

### Audit Routes (`/api/v1/audit`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Super Admin | List audit logs (paginated, filtered) |

---

## 9. Workflow Diagrams

### 9.1 New Training Record Creation Workflow

```
User navigates to /training/add
        │
        ▼
Types staff number → Autocomplete fires
        │
        ▼
GET /api/v1/staff/search?q=...
        │
        ▼
Staff list appears → User selects staff member
        │
        ▼
Read-only staff fields auto-fill (name, designation, group, etc.)
        │
        ▼
User fills in training details
        │
        ▼
User clicks "Save" → Client validates required fields + date order
        │
        ├── Validation Fails → Show inline errors, stop
        │
        ▼
GET /api/v1/training/check-duplicate (pre-check)
        │
        ├── Duplicate Found → Show error "record already exists", stop
        │
        ▼
POST /api/v1/training
        │
        ├── Server validates: Staff exists → Date order → Duplicate compound check
        │
        ├── Any validation fails → Return 400/409 with field errors
        │
        ▼
TrainingRecord saved with denormalized staff info
        │
        ▼
Audit Log entry: CREATE + TrainingRecord + after snapshot + IP
        │
        ▼
Success response → Frontend shows toast + redirects to Training List
```

### 9.2 Bulk Upload Workflow

```
User downloads template → Fills with training data → Saves file
        │
        ▼
User drags file to dropzone on /bulk-upload
        │
        ▼
User clicks "Start Validation"
        │
        ▼
POST /api/v1/upload/training (multipart/form-data)
        │
        ▼
Server: Create UploadBatch { status: 'processing', batchId: UUID }
Audit Log: BULK_UPLOAD action
Return: 202 Accepted { batchId }
        │
        ▼
Background async process: uploadService.processBulkUpload(filePath, batchId, userId)
        │
        │  For each row in the file:
        │  ├── Parse and clean values
        │  ├── Validate required fields → if invalid: push to errors[]
        │  ├── Validate date formats and logical order → if invalid: push to errors[]
        │  ├── Lookup staff in DB → if not found: push to errors[]
        │  ├── Check compound duplicate (staffNum + module + startDate) → if found: push to duplicates[]
        │  └── If all valid: create TrainingRecord → increment successCount
        │
        ▼
UploadBatch updated: { status: 'completed', successCount, errorCount, duplicateCount, errors[], duplicates[] }
        │
        ▼
Frontend polling (every 2s): GET /api/v1/upload/batches/:batchId
        │
        ├── status === 'processing' → update progress bar, continue polling
        │
        ├── status === 'completed' → stop polling, show results cards + error tables
        │
        └── status === 'failed' → stop polling, show error toast
```

### 9.3 User Account Creation Workflow (Super Admin)

```
Super Admin navigates to /users/add
        │
        ▼
Enters Staff Number → System fetches staff name from Staff collection
        │
        ├── Staff Not Found → Error "Staff number does not exist in master list"
        │
        ▼
Assigns Role (admin or super_admin) + sets temporary password + email
        │
        ▼
POST /api/v1/users
        │
        ▼
Server checks:
1. Staff exists in Staff collection
2. No user already exists with that staffNumber or email
3. Role limit check:
   - super_admin: max 1 active → reject if 1 already exists
   - admin: max 6 active → reject if 6 already exist
        │
        ├── Any check fails → Return 400/409 error
        │
        ▼
Hash password (bcrypt, 12 rounds)
Create User document { staffNumber, name: staff.staffName, email, passwordHash, role, isActive: true }
        │
        ▼
Audit Log: CREATE + User + after snapshot
Return: 201 Created
        │
        ▼
Admin receives temporary password from Super Admin (out-of-band communication)
        │
        ▼
Admin logs in with temporary password
        │
        ▼
Server detects mustChangePassword: true (default password comparison)
        │
        ▼
Frontend redirects to /change-password (forced)
        │
        ▼
Admin sets new secure password → System enforced complexity validation
        │
        ▼
Admin fully onboarded and operational
```

---

## 10. Business Rules & Validations

### 10.1 User Account Rules

| Rule | Details |
|------|---------|
| Max 1 active Super Admin | Enforced on create, update, and activate operations |
| Max 6 active Admins | Enforced on create, update, and activate operations |
| Self-deactivation blocked | Super Admin cannot deactivate own account |
| Self-deletion blocked | Any user cannot delete own account |
| Unique Staff Number | One system account per staff member |
| Unique Email | No two accounts can share the same email |

### 10.2 Training Record Rules

| Rule | Details |
|------|---------|
| Staff must exist | `staffNumber` must be in Staff collection (not deleted) |
| Compound uniqueness | staffNumber + trainingModuleNumber + startDateOfTraining must be unique per active record |
| End Date >= Start Date | Always enforced |
| Request Processed Date >= Start Date | Enforced unless value is literal "-" or null |
| Module Number format | Alphanumeric characters, dashes, underscores only (regex: `/^[a-zA-Z0-9-_]+$/`) |
| Duration >= 0 | Cannot be negative |
| Soft delete only | Records are never hard-deleted; `isDeleted` flag used |

### 10.3 Bulk Upload Validation Rules

Each row is validated independently. A row is rejected (pushed to errors[]) if:
- Required fields are missing
- Date format is invalid (not parseable as DD/MM/YYYY or YYYY-MM-DD)
- End Date is before Start Date
- Request Processed Date is before Start Date (unless "-")
- Staff Number does not exist in Staff collection
- Training Status value is not in allowed enum
- Training Type value is not in allowed enum
- Training Mode value is not in allowed enum

A row is skipped as duplicate (pushed to duplicates[]) if:
- Same staffNumber + trainingModuleNumber + startDateOfTraining already exists in the database

### 10.4 Password Rules

| Rule | Requirement |
|------|------------|
| Minimum length | 8 characters |
| Uppercase | At least 1 uppercase letter (A-Z) |
| Lowercase | At least 1 lowercase letter (a-z) |
| Number | At least 1 digit (0-9) |
| Special character | At least 1 of: `@$!%*?&` |
| Not same as current | New password must differ from current |

### 10.5 Indian Financial Year Logic

- FY starts **April 1** and ends **March 31**
- Format: `"FY 2025-26"` means April 1, 2025 → March 31, 2026
- Quarter mapping:
  - Q1: April 1 – June 30
  - Q2: July 1 – September 30
  - Q3: October 1 – December 31
  - Q4: January 1 – March 31
- All date comparisons use UTC midnight normalization to avoid timezone issues

---

## 11. Key Features Summary

### Critical Features (Must-Haves)

| Feature | Description |
|---------|-------------|
| **Role-Based Access Control** | Two distinct roles with granular permission enforcement at both API and UI level |
| **Dual Token Authentication** | Access token (8h) + Refresh token in httpOnly cookie (7d); automatic session refresh |
| **Training Record Denormalization** | Staff details are copied into training records at creation time for historical accuracy |
| **Compound Duplicate Prevention** | MongoDB partial unique index prevents duplicate training records for active entries |
| **Asynchronous Bulk Upload** | Large file imports run in background without timeout; real-time progress polling |
| **Audit Trail** | Every write action logged with before/after JSON snapshots and IP address |
| **Soft Delete Architecture** | No data is ever permanently deleted; `isDeleted` flag used throughout |

### Important Features

| Feature | Description |
|---------|-------------|
| **Indian FY Support** | All date filtering, reporting, and charting respects April→March financial year |
| **Master Data System** | Configurable dropdown values for all form fields without code changes |
| **8 Report Types** | Monthly, Quarterly, FY, Staff-wise, Dept-wise, Cost, Status, Beneficiary |
| **3 Export Formats** | Reports exportable as Excel (.xlsx), PDF, or CSV |
| **Staff Autocomplete** | Live search with auto-fill of read-only fields when adding training records |
| **Pre-submission Duplicate Check** | Client queries server before saving to give immediate feedback |
| **Upload Error Report** | Downloadable Excel with detailed error and duplicate information per row |
| **System Limits Enforcement** | Hard limits on Super Admin (1) and Admin (6) active accounts |

### Nice-to-Have Features

| Feature | Description |
|---------|-------------|
| **Dark Mode** | Full dark mode support via TailwindCSS dark: variants |
| **Dashboard Analytics** | 5 different chart types (Bar, Donut Pie, Horizontal Bar, Progress Bars) |
| **Responsive Design** | Mobile-friendly grid layouts throughout |
| **Toast Notifications** | Non-blocking success/error/info feedback |
| **Rate Limiting** | API protection against brute-force attacks |
| **NoSQL Injection Prevention** | express-mongo-sanitize strips `$` and `.` from request bodies |
| **HTTP Security Headers** | Helmet.js configures all recommended security headers |

---

## 12. Deployment & Environment Configuration

### Server Environment Variables (`.env`)

```bash
# Database
MONGO_URI=mongodb://localhost:27017/kmg_tms

# Server
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_ACCESS_EXPIRY=8h
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_REFRESH_EXPIRY=7d

# CORS
FRONTEND_URL=http://localhost:5173
```

### Development Commands

```bash
# Start Backend (from server/)
npm run dev   # Uses nodemon for hot reload

# Start Frontend (from client/)
npm run dev   # Uses Vite dev server on port 5173

# Seed initial Super Admin
node scripts/seedSuperAdmin.js
```

### Production Notes

- In production, `NODE_ENV=production`:
  - Morgan HTTP logging is disabled
  - Refresh token cookie has `secure: true` (HTTPS only)
  - CORS is locked to the specific FRONTEND_URL
- The client is built with `npm run build` and served as static files
- MongoDB should use authentication in production

---

*Document generated: June 12, 2026*
*Project: KMG Training Management System (KMG-TMS)*
*Version: 1.0*
