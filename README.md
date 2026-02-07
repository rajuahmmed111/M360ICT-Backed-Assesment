# 🧑‍💼 HR Management Backend API

A RESTful HR Management backend system built with **Node.js**, **TypeScript**, **Express**, and **PostgreSQL**. This system allows HR users to authenticate, manage employees, record attendance, and generate monthly attendance reports.

---

## 🚀 Features

- 🔐 JWT Authentication for HR users
- 👨‍💻 Employee Management (CRUD with photo upload)
- 🕒 Attendance Tracking (Upsert support)
- 📊 Monthly Attendance Reporting
- 🔍 Filtering, Search & Pagination
- 🗄 SQL Database using PostgreSQL
- 📦 Prisma Query Builder with Migrations & Seeds
- ✅ Input Validation using Zod / Express Validator
- 📁 Local File Upload with Multer
- 🌍 Environment-based Configuration
- 🎯 Type-safe APIs using TypeScript
- 🧹 ESLint & Prettier Configured

---

## 🛠 Tech Stack

- Node.js
- TypeScript
- Express.js
- Knex.js
- PostgreSQL
- JWT Authentication
- Multer
- Joi / Express Validator
- ESLint & Prettier

---

## 📂 Project Structure

src/
│
├── app/
│ ├── config/
│ ├── modules/
│ │ ├── auth/
│ │ ├── employees/
│ │ ├── attendance/
│ │ └── reports/
│ ├── middlewares/
│ ├── utils/
│ └── types/
│
├── prisma/
│ ├── migrations/
│ └── seeds/
│
├── uploads/
├── server.ts
└── app.ts

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
https://github.com/rajuahmmed111/M360ICT-Backed-Assesment.git
cd M360ICT-Backed-Assesment


npm install


# Environment
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL="postgresql://postgres:post@1234@localhost:5432/M360ICT?schema=public"

# Email
EMAIL=your_email@example.com
APP_PASS=your_email_app_password
CONTACT_MAIL_ADDRESS=contact_email@example.com

# JWT
JWT_SECRET=your_jwt_secret
EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=1y
RESET_PASS_TOKEN=your_reset_password_token
RESET_PASS_TOKEN_EXPIRES_IN=1d

# Cloudinary
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloud_api_key
CLOUDINARY_API_SECRET=your_cloud_api_secret
```


🗄 Database Schema
HR Users Table
Column	Type
id	Primary Key
email	Unique
password_hash	String
name	String
created_at	Timestamp
updated_at	Timestamp
Employees Table
Column	Type
id	Primary Key
name	String
age	Integer
designation	String
hiring_date	Date
date_of_birth	Date
salary	Decimal
photo_path	String
created_at	Timestamp
updated_at	Timestamp
Attendance Table
Column	Type
id	Primary Key
employee_id	Foreign Key
date	Date
check_in_time	Time

Unique Constraint: (employee_id, date)