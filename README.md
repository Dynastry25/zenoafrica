# 🌍 Zeno Africa Adventures

A modern, premium, full-stack tourism and travel booking platform for **Zeno Africa Adventures** — featuring luxury safari packages, hotel reservations, visa assistance, flight bookings, secure payments, and a comprehensive admin dashboard.

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![Node](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwindcss)

---

## ✨ Features

### For Travelers
- 🦁 Browse luxury safari & adventure packages with rich filtering and search
- 📅 Multi-step booking flow with deposit/full payment options
- 📋 Visa assistance application with document tracking
- 🏨 Hotel & lodge browsing
- ✈ Flight booking requests
- 💳 Secure payments via Stripe (card, bank transfer, mobile money)
- 🔔 Real-time notifications for bookings, payments, and visa updates
- 👤 Personal dashboard: bookings, payments, visa status, profile management
- ⭐ Loyalty points system

### For Administrators
- 📊 Analytics dashboard with revenue charts, booking trends, top packages
- 📦 Full CRUD package management
- 🗂 Booking management with status updates
- 📋 Visa application review & approval workflow
- 👥 User management with role-based access control
- 💬 Customer enquiry management
- 📈 Revenue reports by category and time period
- 📢 Broadcast notifications to users

### Design
- 🎨 Luxury gold-gradient theme with glassmorphism cards
- 🌅 Parallax hero with Ken Burns image transitions
- 📱 Fully responsive, mobile-first design
- ✨ Smooth Framer Motion animations throughout
- 🌙 Premium dark theme inspired by high-end safari & travel brands

---

## 🏗 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Redux Toolkit, React Router v6, Tailwind CSS, Framer Motion, Axios |
| **Backend** | Node.js, Express.js, JWT Auth, bcrypt |
| **Database** | MongoDB Atlas + Mongoose ODM |
| **Payments** | Stripe (Payment Intents API) |
| **Email** | Nodemailer (SMTP) |
| **File Storage** | Cloudinary |
| **Charts** | Recharts |

---

## 📁 Project Structure

```
zeno-africa/
├── backend/                 # Express.js REST API
│   ├── src/
│   │   ├── config/          # DB config
│   │   ├── controllers/      # Route handlers
│   │   ├── middleware/       # Auth, error handling
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/            # API routes
│   │   ├── utils/             # Email, seeder
│   │   └── server.js          # Entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/                 # React + Vite app
    ├── src/
    │   ├── api/               # Axios API client
    │   ├── components/
    │   │   ├── admin/
    │   │   ├── auth/
    │   │   ├── booking/
    │   │   ├── common/
    │   │   ├── home/
    │   │   ├── layout/
    │   │   └── visa/
    │   ├── pages/
    │   │   ├── admin/
    │   │   └── dashboard/
    │   ├── redux/
    │   │   ├── slices/
    │   │   └── store.js
    │   ├── styles/
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env.example
    ├── index.html
    ├── tailwind.config.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Stripe account (for payments)
- Gmail/SMTP account (for emails)
- Cloudinary account (for image uploads)

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, Stripe keys, SMTP credentials, etc.

# Seed the database with sample packages, hotels, and admin user
npm run seed

# Start development server
npm run dev
```

The API will run on `http://localhost:5000`

**Default seeded accounts:**
- Admin: `admin@zenoafrica.com` / `Admin@123456`
- Sample User: `jane@example.com` / `Password123!`

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL and Stripe publishable key

npm run dev
```

The app will run on `http://localhost:3000`

---

## 🔑 Environment Variables

### Backend (`.env`)
See `backend/.env.example` for all variables including:
- `MONGO_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — Secret key for JWT signing
- `STRIPE_SECRET_KEY` — Stripe secret key
- `SMTP_*` — Email configuration
- `CLOUDINARY_*` — Image upload configuration

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/packages` | List packages (filterable) | Public |
| GET | `/api/packages/:slug` | Package details | Public |
| POST | `/api/bookings` | Create booking | User |
| GET | `/api/bookings/my` | My bookings | User |
| POST | `/api/payments/create-intent` | Create Stripe payment intent | User |
| POST | `/api/visa` | Submit visa application | Public/User |
| GET | `/api/admin/dashboard` | Admin analytics | Admin |
| GET | `/api/admin/users` | Manage users | Admin |

Full API documentation available in `backend/src/routes/`.

---

## 🔒 Security Features

- JWT-based authentication with httpOnly cookies
- bcrypt password hashing (12 rounds)
- Role-based access control (user / admin / super_admin)
- Rate limiting on auth endpoints
- MongoDB injection sanitization
- Helmet security headers
- Input validation on all forms

---

## 📄 License

© 2024 Zeno Africa Adventures. All rights reserved.

---

## 📞 Contact

- **Phone/WhatsApp:** 0674 448 795
- **Email:** zenoafricaadventures@gmail.com
- **Location:** Johannesburg, South Africa
