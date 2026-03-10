# EMR Appointment & Booking Management System — Backend

> A modular, production-ready REST API for an Electronic Medical Record (EMR) system. Handles appointment booking, patient management, doctor scheduling, and dynamic slot generation using a **Controller → Service → Model** architecture.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (v16+) |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Language | TypeScript |
| Authentication | JWT — Access & Refresh Tokens (HTTP-only cookies) |
| Transactions | MongoDB Sessions |

---

## 🏛️ Architecture

```
src/
├── app.ts                      # Express app setup, CORS, cookie-parser, routes
├── server.ts                   # Entry point
│
├── constants/
│   └── roles.ts                # UserRole enum (SUPER_ADMIN, ADMIN, DOCTOR, RECEPTIONIST, PATIENT)
│
├── middlewares/
│   ├── auth.middleware.ts       # Verifies JWT from HTTP-only cookie → sets req.user
│   └── role.middleware.ts       # authorizeRoles() — guards protected routes
│
├── utils/
│   └── jwt.ts                  # generateAccessToken, generateRefreshToken, verifyAccessToken
│                               # TokenPayload: { userId: string, role: UserRole }
│
└── modules/
    ├── auth/                   # Login, logout, token refresh
    ├── user/                   # User CRUD (SUPER_ADMIN only)
    ├── doctor/                 # Doctor profiles & scheduling
    ├── patient/                # Patient registration & search
    ├── appointment/            # Appointment booking, status, deletion
    └── slots/                  # Dynamic slot generation
```

### Controller → Service → Model Pattern

| Layer | Responsibility |
|---|---|
| **Controller** | Parses request, validates params, sends response |
| **Service** | All business logic — booking rules, slot generation, transactions |
| **Model** | Mongoose schema, indexes, TypeScript interfaces |

---

## 🚀 Setup & Installation

### 1. Prerequisites
- Node.js v16+
- MongoDB Atlas account or local MongoDB instance

### 2. Clone & Install
```bash
git clone <repository_url>
cd backend
npm install
```

### 3. Environment Variables
Create `.env` in the `backend/` root:

```env
PORT=8000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/emr-system
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Cookie Configuration
COOKIE_SECURE=false           # Set to true in production (requires HTTPS)
COOKIE_SAME_SITE=lax          # set to 'none' for cross-domain hosting
ACCESS_COOKIE_MAXAGE=900000   # 15 minutes in ms
REFRESH_COOKIE_MAXAGE=604800000 # 7 days in ms
```

### 4. Run

```bash
# Development (auto-reload via ts-node-dev)
npm run dev

# Production build
npm run build
npm start
```

---

## 📑 API Reference

> All protected routes require a valid JWT in an HTTP-only `accessToken` cookie. The auth middleware reads `req.user.userId` and `req.user.role` from the decoded token.

### 🔐 Auth Module — `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Returns access + refresh tokens as HTTP-only cookies |
| `POST` | `/api/auth/refresh` | Public | Issues a new access token using the refresh token cookie |
| `POST` | `/api/auth/logout` | Auth | Clears token cookies |

### 👥 User Module — `/api/users`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/users` | SUPER_ADMIN | List all users (paginated) |
| `POST` | `/api/users` | SUPER_ADMIN | Create a new user with a role |
| `PATCH` | `/api/users/:id` | SUPER_ADMIN | Update user role or status |

### 🩺 Doctor Module — `/api/doctors`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/doctors` | Auth | List active doctors (filter by `department`, `page`, `limit`) |
| `GET` | `/api/doctors/me` | Auth (DOCTOR) | Get the doctor profile of the logged-in user |
| `GET` | `/api/doctors/:id` | Auth | Get doctor profile by MongoDB `_id` |
| `POST` | `/api/doctors` | SUPER_ADMIN | Create a doctor profile linked to a user |
| `PATCH` | `/api/doctors/:id` | SUPER_ADMIN | Update doctor info (specialization, fee, etc.) |
| `PATCH` | `/api/doctors/:id/availability` | SUPER_ADMIN | Update working hours, break times, available days, slot duration |

> **Note:** `GET /doctors/me` uses `req.user.userId` (from JWT `TokenPayload`) to find the `Doctor` document where `user === userId`.

### 🧑‍⚕️ Patient Module — `/api/patients`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/patients` | Auth | List patients (optional `q` search, `page`, `limit`) |
| `POST` | `/api/patients` | Auth | Register a new patient (auto-generates `patientId` like `PAT-1001`) |
| `GET` | `/api/patients/:id` | Auth | Get patient by MongoDB `_id` |
| `GET` | `/api/patients/search` | Auth | Fast search by `name`, `mobile`, or `patientId` (max 10 results) |

**Patient schema fields:**

| Field | Type | Notes |
|---|---|---|
| `patientId` | `string` | Auto-generated (`PAT-1001`, `PAT-1002`, …) |
| `name` | `string` | Required |
| `mobile` | `string` | Required |
| `email` | `string` | Optional |
| `gender` | `string` | Optional |
| `age` | `number` | Optional |

### 📅 Appointment Module — `/api/appointments`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/appointments` | Auth | Book an appointment |
| `GET` | `/api/appointments` | Auth | List appointments (filter: `doctorId`, `date`, `status`, `page`, `limit`) |
| `PATCH` | `/api/appointments/:id` | Auth | Update `purpose` / `notes` |
| `DELETE` | `/api/appointments/:id` | Auth | Hard-delete an appointment |
| `PATCH` | `/api/appointments/:id/arrive` | Auth | Mark patient as arrived (sets `status=ARRIVED`, `arrivalTime`) |

**POST /api/appointments — Request Body:**

```json
{
  "doctorId": "<Doctor MongoDB _id>",
  "date": "YYYY-MM-DD",
  "time": "HH:mm",
  "patientType": "EXISTING",
  "patientId": "PAT-1001",
  "purpose": "General checkup",
  "notes": "Optional notes"
}
```

For a NEW patient registration + booking in one transaction:

```json
{
  "doctorId": "<Doctor MongoDB _id>",
  "date": "2025-03-10",
  "time": "09:30",
  "patientType": "NEW",
  "patientData": { "name": "John Doe", "mobile": "9876543210" },
  "purpose": "Fever"
}
```

**AppointmentStatus enum:** `BOOKED` | `ARRIVED`

### 🕐 Slot Module — `/api/slots`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/slots` | Auth | Generate available time slots for a doctor on a date |

**Query params:** `?doctorId=<id>&date=YYYY-MM-DD`

**Response shape:**
```json
[
  { "time": "09:00", "isBooked": false, "status": "available" },
  { "time": "09:30", "isBooked": true,  "status": "booked"    }
]
```

Slots are generated **on-the-fly** (not stored) based on:
- Doctor's `workingHours` (start/end)
- `slotDuration` (minutes)
- `breakTimes` (excluded)
- `availableDays` (day-of-week check with local timezone)
- Existing `Appointment` records for that doctor+date
- Past slots on today's date are excluded

---

## 🛡️ Core Features & Design Decisions

### Double Booking Prevention
A compound unique index `{ doctor: 1, date: 1, time: 1 }` on the Appointment collection prevents duplicate bookings at the database level. The `11000` duplicate key error is caught and returned as a `409 Conflict`.

### Atomic Patient + Appointment Creation
When `patientType === 'NEW'`, a MongoDB **transaction session** is used to create the patient and appointment atomically — if either fails, both are rolled back.

### Dynamic Slot Generation
Slots are **never stored** in the database. They are computed on every request from the doctor's schedule configuration and checked against existing appointments. This keeps storage minimal and ensures real-time accuracy.

### JWT + HTTP-only Cookies
- Access token: 15m expiry, stored in `accessToken` cookie
- Refresh token: 7d expiry, stored in `refreshToken` cookie  
- `TokenPayload`: `{ userId: string, role: UserRole }`
- Token field in payload is `userId` (not `_id`)

### Performance Optimizations
- `.lean()` for read-heavy list queries
- Compound indexes on frequently filtered fields (`doctor + date`, `doctor + date + time`)
- Text index on Patient (`name`, `mobile`, `patientId`) for full-text search
- Pagination (`page`, `limit`) with `countDocuments` for total

---

## 📜 License

ISC
