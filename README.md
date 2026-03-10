# EMR Appointment & Booking Management System (Backend)

## 🩺 Overview
A robust backend system for the Electronic Medical Record (EMR) system, focusing on efficient appointment booking, patient management, and doctor scheduling. Built with **Node.js, Express, MongoDB, and TypeScript**, the system handles complex workflows like dynamic slot generation, double-booking prevention, and secure search using a modular architecture.

---

## 🛠️ Tech Stack
- **Engine**: [Node.js](https://nodejs.org/) (v16+)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (using [Mongoose](https://mongoosejs.com/))
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Authentication**: JWT (Access & Refresh Tokens)
- **Validation**: Zod (if applicable) / Custom TypeScript interfaces

---

## 🏛️ Architecture & Best Practices
The project follows a **Modular Design** pattern based on **Controller → Service → Model** separation:

1.  **Controller**: Handles incoming requests, validates parameters, and returns responses.
2.  **Service**: Contains all business logic (e.g., booking rules, slot calculations, transactions).
3.  **Model**: Defines schema, document types, and database-level indexes.
4.  **Middleware**: Common functionalities like authentication, error handling, and rate limiting.

### Performance Optimizations:
- **Index-Driven Queries**: Compound unique indexes for conflict prevention.
-  **Pagination Support**: Optimized list views with skip/limit and total count.
-  **Projection & Lean**: Returns minimal necessary data and uses `.lean()` for faster CPU/Memory execution.

---

## 🚀 Setup & Installation

### 1. Prerequisites
- Node.js (v16.x or higher)
- MongoDB Atlas account or local installation.

### 2. Clone & Install
```bash
git clone <repository_url>
cd backend
npm install
```

### 3. Environment Variable Setup
Create a `.env` file in the `backend` root and add:
```env
PORT=8000
MONGODB_URI=mongodb+srv://user:pass@cluster0.net/emr-system
JWT_ACCESS_SECRET=your_access_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
NODE_ENV=development
```

### 4. Running the Project
```bash
# Development (with auto-reload)
npm run dev

# Production Build
npm run build
npm start
```

---

## 📑 API Documentation (Key Endpoints)

### 🏥 Doctor Module
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/doctors` | List doctors (supports `department`, `page`, `limit`). |
| `GET` | `/api/doctors/:id` | Get detailed doctor profile. |
| `PATCH` | `/api/doctors/:id` | Update doctor info (Admin/Doctor only). |

### 📅 Appointment Module
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/appointments` | Book new appt (Handles NEW/EXISTING patients). |
| `GET` | `/api/appointments` | List appointments (Filter by `doctorId`, `date`, `status`). |
| `PATCH` | `/api/appointments/:id` | Update purpose/notes. |
| `DELETE` | `/api/appointments/:id` | Cancel appointment (Soft delete). |
| `PATCH` | `/api/appointments/:id/arrive` | Mark patient as arrived (Update status + timestamp). |

### 🔍 Search & Discovery
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/slots` | Generate available slots dynamically (`doctorId`, `date`). |
| `GET` | `/api/patients/search` | Fast search patients by `name`, `mobile`, or `patientId`. |

---

## 🛡️ Core Features

- **Double Booking Prevention**: Utilizes a compound unique index `{ doctor, date, time }` to handle concurrent bookings atomically.
- **Dynamic Slot Generation**: Slots are calculated on-the-fly based on doctor's working hours, break times, and existing bookings. No database storage for empty slots!
- **Atomic Transactions**: Creating a **New Patient** and an **Appointment** together uses MongoDB sessions to ensure data consistency.
- **Patient ID Tracking**: Automatically assigns unique handles (e.g., `PAT-1001`) for long-term patient tracking.

---

## 📜 License
This project is licensed under the [ISC License](LICENSE).
