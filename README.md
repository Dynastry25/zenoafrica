# Zeno Africa Adventures — Full Project Documentation

> **Version**: 1.0.0  
> **Stack**: MERN (MongoDB, Express, React 18, Node.js)  
> **Deployment**: Vercel (frontend + serverless API)  
> **Database**: MongoDB Atlas  

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture](#3-architecture)
4. [Getting Started](#4-getting-started)
5. [Backend Documentation](#5-backend-documentation)
6. [Frontend Documentation](#6-frontend-documentation)
7. [Admin Panel](#7-admin-panel)
8. [API Reference](#8-api-reference)
9. [Database Models](#9-database-models)
11. [Deployment](#10-deployment)
12. [Environment Variables](#11-environment-variables)

---

## 1. Project Overview

**Zeno Africa Adventures** is a full-stack luxury safari and travel booking platform based in Tanzania. It allows users to:

- Browse and book safari tour packages
- Apply for visas
- Make payments via Stripe
- Manage bookings from a personal dashboard
- Contact the team via forms and WhatsApp

The platform includes an **admin panel** for managing packages, bookings, users, visa applications, enquiries, and viewing analytics.

### Key Features

| Feature | Description |
|---------|------------|
| Package Booking | Browse safari packages, view details, book with payment |
| Stripe Payments | Secure payment processing via Stripe |
| Visa Applications | Submit and track visa applications |
| User Dashboard | View bookings, visa apps, payments, notifications, profile |
| Admin Dashboard | Manage all entities, view charts and reports |
| WhatsApp Integration | Floating WhatsApp button + package inquiry links |
| Partners Page | Airline partner showcase with detail pages |
| Email System | Verification emails, password reset via Nodemailer |
| Cloudinary Uploads | Image uploads for packages and media |
| Responsive Design | Mobile-first across all pages |
| JWT Authentication | Secure multi-role auth (user, admin, super_admin) |

---

## 2. Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS 3.4 | Utility-first CSS |
| Redux Toolkit | State management |
| React Router v6 | Client-side routing |
| Framer Motion | Animations |
| Recharts | Admin dashboard charts |
| Axios | HTTP client |
| React Icons | Icon library |
| React Hot Toast | Toast notifications |
| React Hook Form | Form handling |
| Swiper | Carousel/slider |

### Backend

| Technology | Purpose |
|------------|---------|
| Express.js | HTTP server |
| MongoDB + Mongoose | Database + ODM |
| JSON Web Tokens | Authentication |
| bcryptjs | Password hashing |
| Stripe | Payment processing |
| Cloudinary | Image hosting |
| Nodemailer | Email sending |
| express-rate-limit | Rate limiting |
| express-mongo-sanitize | NoSQL injection prevention |
| Helmet | HTTP header security |
| Multer | File upload handling |
| express-validator | Input validation |

### Infrastructure

| Technology | Purpose |
|------------|---------|
| Vercel | Frontend & serverless API hosting |
| MongoDB Atlas | Cloud database |
| Cloudinary | Image CDN |

---

## 3. Architecture

```
zenoafrica/
├── api/
│   └── index.js                  # Vercel serverless entry point
├── backend/
│   ├── package.json              # CommonJS module system
│   └── src/
│       ├── server.js             # Express backend (standalone)
│       ├── controllers/          # Business logic
│       ├── routes/               # API route definitions
│       ├── models/               # Mongoose schemas
│       ├── middleware/           # Auth, error handling
│       └── utils/                # Email, seeder
├── frontend/
│   ├── package.json              # ESM module system
│   ├── vite.config.js            # Vite + proxy config
│   ├── tailwind.config.js        # ZAA brand theme
│   ├── public/                   # Static assets
│   └── src/
│       ├── main.jsx              # React entry
│       ├── App.jsx               # Router
│       ├── api/axios.js          # API client
│       ├── redux/                # State management
│       ├── pages/                # Route pages
│       ├── admin/                # Admin panel
│       ├── components/           # Reusable components
│       ├── data/                 # Static data (partners)
│       └── styles/index.css      # Global styles + animations
├── server.js                     # Production server (ESM + CJS bridge)
├── package.json                  # Root scripts + combined deps
├── vercel.json                   # Deployment config
└── .env                          # Environment variables
```

### Request Flow

```
Browser → Vite Proxy (/api/*) → Express (localhost:5000)
Browser → Vercel (/api/*) → api/index.js → server.js → MongoDB
```

---

## 4. Getting Started

### Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas account
- Stripe account (for payments)
- Cloudinary account (for image uploads)

### Installation

```bash
# Clone repository
git clone https://github.com/Dynastry25/zenoafrica.git
cd zenoafrica

# Install all dependencies
npm install
cd frontend && npm install && cd ..
```

### Environment Setup

Copy `.env.example` values into `.env` at the project root:

```env
MONGODB_URI=mongodb+srv://...
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
VITE_API_URL=/api
```

### Running Development

```bash
# Run both backend + frontend concurrently
npm run dev:full

# Or run separately:
npm run dev:backend    # Express on port 5000
npm run dev:frontend   # Vite on port 3000
```

### Database Seeding

```bash
node backend/src/utils/seeder.js
```

This creates 7 sample packages (Serengeti, Kilimanjaro, Cape Town, Victoria Falls, Marrakech, Gorilla Trek, Zanzibar).

### Production Server

```bash
npm run build     # Build frontend
npm start         # Run combined server on port 5000
```

---

## 5. Backend Documentation

### Entry Points

| File | Module | Usage |
|------|--------|-------|
| `backend/src/server.js` | CommonJS | Standalone backend (development) |
| `server.js` (root) | ESM | Combined production server |
| `api/index.js` | ESM | Vercel serverless adapter |

### Controllers

#### `auth.controller.js`
- `register` — Create user account, send verification email
- `login` — Authenticate, return JWT
- `verifyEmail` — Confirm email address
- `forgotPassword` — Generate reset token, send email
- `resetPassword` — Update password with token

#### `package.controller.js`
- `getPackages` — List packages with filters (category, price, difficulty, search), pagination, sorting
- `getFeaturedPackages` — Get featured packages (isFeatured: true)
- `getPackage` — Get single package by slug with reviews
- `searchPackages` — Full-text search on title, description, tags
- `getCategoryStats` — Aggregate stats per category
- `createPackage` — Admin: create package
- `updatePackage` — Admin: update package
- `deletePackage` — Admin: soft-delete (isActive: false)

#### `booking.controller.js`
- `createBooking` — Create booking for a package
- `getUserBookings` — Get current user's bookings
- `getBooking` — Get single booking
- `updateBookingStatus` — Admin: update booking status
- `cancelBooking` — Cancel a booking

#### `payment.controller.js`
- `createPaymentIntent` — Create Stripe payment intent
- `confirmPayment` — Confirm payment and update booking
- `webhookHandler` — Handle Stripe webhook events

#### `admin.controller.js`
- `getStats` — Dashboard statistics (total users, bookings, revenue, etc.)
- `getAdminBookings` — List all bookings (admin)
- `updateBookingStatus` — Update booking status
- `getUsers` — List all users
- `updateUserRole` — Change user role

### Routes

| Route File | Base Path | Endpoints |
|-----------|-----------|-----------|
| `auth.routes.js` | `/api/auth` | POST `/register`, POST `/login`, GET `/verify-email/:token`, POST `/forgot-password`, POST `/reset-password/:token` |
| `user.routes.js` | `/api/users` | GET `/profile`, PUT `/profile`, DELETE `/account` |
| `package.routes.js` | `/api/packages` | GET `/`, GET `/featured`, GET `/search`, GET `/categories/stats`, GET `/:slug`, POST `/`, PUT `/:id`, DELETE `/:id` |
| `booking.routes.js` | `/api/bookings` | POST `/`, GET `/my`, GET `/:id`, PUT `/:id`, DELETE `/:id` |
| `payment.routes.js` | `/api/payments` | POST `/create-intent`, POST `/confirm`, POST `/webhook` |
| `visa.routes.js` | `/api/visa` | POST `/`, GET `/`, GET `/:id`, PUT `/:id` |
| `hotel.routes.js` | `/api/hotels` | GET `/`, POST `/` |
| `flight.routes.js` | `/api/flights` | GET `/`, POST `/` |
| `review.routes.js` | `/api/reviews` | POST `/`, GET `/:packageId`, PUT `/:id`, DELETE `/:id` |
| `notification.routes.js` | `/api/notifications` | GET `/`, PUT `/:id/read`, DELETE `/:id` |
| `admin.routes.js` | `/api/admin` | GET `/stats`, GET `/bookings`, PUT `/bookings/:id`, GET `/users`, PUT `/users/:id/role` |
| `upload.routes.js` | `/api/upload` | POST `/image`, POST `/images` |
| `contact.routes.js` | `/api/contact` | POST `/` |

### Middleware

| File | Exports | Purpose |
|------|---------|---------|
| `auth.middleware.js` | `protect`, `authorize`, `optionalAuth` | JWT verification, role-based access |
| `error.middleware.js` | `errorHandler` | Centralized error handling (400, 401, 404, 500) |

### Security

- **CORS**: Configured for localhost:3000, localhost:5173, and production URL
- **Helmet**: HTTP security headers
- **Rate Limiting**: 100 req/15min on API, 20 req/15min on auth endpoints
- **Mongo Sanitize**: Prevents NoSQL injection
- **JWT**: Bearer token authentication with configurable expiry

---

## 6. Frontend Documentation

### Entry Point

`main.jsx` → Redux Provider → BrowserRouter → App

### Routing (`App.jsx`)

#### Public Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `HomePage` | Landing page |
| `/packages` | `PackagesPage` | Package listing with filters |
| `/packages/:slug` | `PackageDetailPage` | Single package view |
| `/services` | `ServicesPage` | Services overview |
| `/about` | `AboutPage` | Company information |
| `/contact` | `ContactPage` | Contact form |
| `/partners` | `PartnersPage` | Partner listing |
| `/partners/:slug` | `PartnerDetailPage` | Individual partner |
| `/privacy` | `PrivacyPolicyPage` | Privacy policy |
| `/terms` | `TermsPage` | Terms of service |
| `/refund-policy` | `RefundPolicyPage` | Refund policy |

#### User Dashboard Routes (Protected)

| Path | Component |
|------|-----------|
| `/dashboard` | `DashboardLayout` |
| `/dashboard` (index) | `DashboardOverview` |
| `/dashboard/bookings` | `MyBookingsPage` |
| `/dashboard/visa` | `VisaApplicationsPage` |
| `/dashboard/payments` | `PaymentsPage` |
| `/dashboard/notifications` | `NotificationsPage` |
| `/dashboard/profile` | `ProfilePage` |

#### Admin Routes (Protected + Role-based)

| Path | Component |
|------|-----------|
| `/admin` | `AdminLayout` |
| `/admin` (index) | `AdminDashboard` |
| `/admin/bookings` | `AdminBookingsPage` |
| `/admin/packages` | `AdminPackagesPage` |
| `/admin/visas` | `AdminVisasPage` |
| `/admin/users` | `AdminUsersPage` |
| `/admin/reports` | `AdminReportsPage` |
| `/admin/enquiries` | `AdminEnquiriesPage` |

### Redux Store

| Slice | State | Purpose |
|-------|-------|---------|
| `authSlice` | user, token, isAuthenticated, loading | Authentication |
| `packageSlice` | packages, package, filters, pagination | Package data |
| `bookingSlice` | bookings, booking, loading | Booking data |
| `uiSlice` | modals (login, register, forgot), mobileMenu | UI state |
| `notificationSlice` | notifications, unreadCount | Notifications |

### API Client (`api/axios.js`)

All API calls go through a centralized Axios instance with:
- **Base URL**: `/api` (proxied in dev, direct on Vercel)
- **Request interceptor**: Attaches JWT token from localStorage
- **Response interceptor**: Handles 401 (auto-logout)

#### API Modules

| Module | Methods |
|--------|---------|
| `authAPI` | `register`, `login`, `getCurrentUser`, `forgotPassword`, `resetPassword`, `verifyEmail` |
| `packageAPI` | `getAll`, `getFeatured`, `getOne`, `search`, `getCategoryStats`, `create`, `update`, `delete` |
| `bookingAPI` | `create`, `getMy`, `getOne`, `getAll`, `updateStatus`, `cancel` |
| `paymentAPI` | `createIntent`, `confirm` |
| `visaAPI` | `create`, `getMy`, `getOne`, `getAll`, `updateStatus` |
| `hotelAPI` | `getAll`, `create` |
| `flightAPI` | `getAll`, `create` |
| `reviewAPI` | `create`, `getByPackage`, `update`, `delete` |
| `notificationAPI` | `getAll`, `markRead`, `delete` |
| `adminAPI` | `getStats`, `getBookings`, `updateBooking`, `getUsers`, `updateUserRole` |
| `contactAPI` | `send` |
| `uploadAPI` | `image`, `images` |

### Components

#### Layout
| Component | File | Description |
|-----------|------|-------------|
| `Navbar` | `components/layout/Navbar.jsx` | Sticky nav with auth state, mobile menu, notifications |
| `Footer` | `components/layout/Footer.jsx` | Site-wide footer with link columns |
| `ModalRouter` | `components/layout/ModalRouter.jsx` | Handles login/register modal routing |

#### Home Page
| Component | File | Description |
|-----------|------|-------------|
| `Hero` | `components/home/Hero.jsx` | Hero section with animated background |
| `FeaturedPackages` | `components/home/FeaturedPackages.jsx` | Featured package cards |
| `Services` | `components/home/Services.jsx` | Services grid |
| `WhyUs` | `components/home/WhyUs.jsx` | Why choose us with floating images |
| `Partners` | `components/home/Partners.jsx` | Infinite scrolling partner logos (2 rows) |
| `Testimonials` | `components/home/Testimonials.jsx` | Customer testimonials carousel |
| `VisaAndCta` | `components/home/VisaAndCta.jsx` | Visa info + CTA banner |

#### Common
| Component | File | Description |
|-----------|------|-------------|
| `PackageCard` | `components/common/PackageCard.jsx` | Package card with Book Now + WhatsApp buttons |
| `Common` | `components/common/Common.jsx` | `formatPrice`, `Spinner`, `EmptyState`, `SectionHeading` |
| `ProtectedRoute` | `components/common/ProtectedRoute.jsx` | Auth guard for routes |
| `WhatsAppFloat` | `components/common/WhatsAppFloat.jsx` | Fixed WhatsApp chat button |

#### Auth
| Component | File | Description |
|-----------|------|-------------|
| `AuthModal` | `components/auth/AuthModal.jsx` | Login / Register modal |
| `ForgotPasswordModal` | `components/auth/ForgotPasswordModal.jsx` | Password reset modal |

#### Booking
| Component | File | Description |
|-----------|------|-------------|
| `BookingModal` | `components/booking/BookingModal.jsx` | Booking form modal |

### Styles (`styles/index.css`)

- **CSS Variables**: `--obsidian`, `--surface`, `--zaa-orange`, `--cream`, etc.
- **Brand Classes**: `.btn-primary`, `.btn-gold`, `.btn-outline`, `.card`, `.zaa-text`, `.section-eyebrow`
- **Animations**: `@keyframes float`, `marquee`, `marquee-reverse`, `fadeInUp`, `kenBurns`, `zaaShimmer`, `zaaGlow`
- **Custom Scrollbar**: Styled scrollbar matching dark theme

### Design System (Tailwind Config)

#### Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `zaa-orange` | `#F4742B` | Primary brand color |
| `zaa-amber` | `#F5A94C` | Secondary accent |
| `obsidian` | `#0D0B09` | Main background |
| `charcoal` | `#161210` | Card backgrounds |
| `surface` | `#1E1916` | Elevated surfaces |
| `cream` | `#F5EDE0` | Primary text |
| `secondary` | `#C4A882` | Secondary text |
| `muted` | `#7A6148` | Muted text |

#### Typography

| Font | Usage |
|------|-------|
| Montserrat | Body text, headings (sans-serif) |
| Playfair Display | Decorative headings (serif) |
| Cormorant Garamond | Accent text |

---

## 7. Admin Panel

Located in `frontend/src/admin/`. Accessible at `/admin` (requires admin or super_admin role).

### Admin Pages

| Page | Description |
|------|-------------|
| `AdminDashboard` | Overview with stats cards, LineChart (bookings), BarChart (revenue), PieChart (categories) |
| `AdminBookingsPage` | Table of all bookings with status management |
| `AdminPackagesPage` | Full CRUD for packages with create/edit forms |
| `AdminVisasPage` | Visa application management |
| `AdminUsersPage` | User list with role management |
| `AdminReportsPage` | Revenue reports with BarChart |
| `AdminEnquiriesPage` | Contact form submissions |

### Admin Layout

- Sidebar navigation with icons (hidden by default, toggleable)
- No public Navbar or Footer
- Dark theme matching the main site

---

## 8. API Reference

### Authentication

```
POST /api/auth/register
Body: { name, email, password }
Response: { success, token, user }

POST /api/auth/login
Body: { email, password }
Response: { success, token, user }

GET /api/auth/verify-email/:token
Response: { success, message }
```

### Packages

```
GET /api/packages?page=1&limit=12&sort=popular&category=safari&search=serengeti
Response: { success, count, total, totalPages, currentPage, packages[] }

GET /api/packages/featured
Response: { success, count, packages[] }

GET /api/packages/:slug
Response: { success, package: { ...pkg, reviews[] } }
```

### Bookings

```
POST /api/bookings (protected)
Body: { packageId, numberOfPeople, travelDate, specialRequests }

GET /api/bookings/my (protected)
Response: { success, bookings[] }
```

### Payments

```
POST /api/payments/create-intent (protected)
Body: { bookingId, amount }
Response: { success, clientSecret }
```

### Contact

```
POST /api/contact
Body: { name, email, phone, subject, message }
```

---

## 9. Database Models

### User
| Field | Type | Notes |
|-------|------|-------|
| name | String | Required |
| email | String | Unique, required |
| password | String | Hashed with bcrypt |
| role | String | user / admin / super_admin |
| avatar | Object | { public_id, url } |
| isVerified | Boolean | Email verification |
| verificationToken | String | For email verification |
| resetPasswordToken | String | For password reset |

### Package
| Field | Type | Notes |
|-------|------|-------|
| title | String | Required, generates slug |
| slug | String | Unique, auto-generated |
| category | String | safari/adventure/luxury/cultural/wildlife/beach/mountain/city |
| description | String | Required |
| shortDescription | String | Max 300 chars |
| location | Object | { country, region, coordinates } |
| duration | Object | { days, nights } |
| price | Object | { adult, child, infant, currency } |
| coverImage | Object | { public_id, url } |
| gallery | Array | [{ public_id, url, caption }] |
| highlights | [String] | |
| included | [String] | |
| excluded | [String] | |
| itinerary | [Object] | { day, title, description, activities, meals, accommodation } |
| difficulty | String | easy/moderate/challenging/expert |
| isFeatured | Boolean | |
| isActive | Boolean | |
| averageRating | Number | 0-5 |
| reviewCount | Number | |
| totalBookings | Number | |

### Booking
| Field | Type | Notes |
|-------|------|-------|
| user | ObjectId | Ref: User |
| package | ObjectId | Ref: Package |
| bookingReference | String | Unique |
| numberOfPeople | Number | |
| travelDate | Date | |
| totalPrice | Number | |
| status | String | pending/confirmed/cancelled/completed |
| paymentStatus | String | unpaid/partial/paid/refunded |
| specialRequests | String | |

### Review
| Field | Type | Notes |
|-------|------|-------|
| user | ObjectId | Ref: User |
| package | ObjectId | Ref: Package |
| rating | Number | 1-5 |
| comment | String | |
| isApproved | Boolean | |

### Visa
| Field | Type | Notes |
|-------|------|-------|
| user | ObjectId | Ref: User |
| destinationCountry | String | |
| visaType | String | |
| travelDate | Date | |
| documents | Array | |
| status | String | pending/processing/approved/rejected |

### Hotel
| Field | Type | Notes |
|-------|------|-------|
| name | String | |
| category | String | lodge/hotel/camp/resort/villa/guesthouse |
| stars | Number | 1-5 |
| location | Object | { country, region, city, address, coordinates } |
| amenities | [String] | |
| priceRange | Object | { min, max, currency } |

### Notification
| Field | Type | Notes |
|-------|------|-------|
| user | ObjectId | Ref: User |
| title | String | |
| message | String | |
| type | String | booking/system/payment |
| isRead | Boolean | |

---

## 10. Deployment

### Vercel Configuration (`vercel.json`)

```json
{
  "installCommand": "npm install && cd frontend && npm install",
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/dist",
  "framework": null,
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/index.js" },
    { "source": "/health", "destination": "/api/index.js" },
    { "source": "/uploads/(.*)", "destination": "/api/index.js" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### How It Works

1. Vercel installs root + frontend dependencies
2. Builds frontend into `frontend/dist/`
3. `api/index.js` serves as the serverless function entry point
4. It imports the full Express app from `server.js`
5. All `/api/*` requests route through the serverless function
6. All other routes serve `index.html` (SPA routing)

### Production Server (`server.js`)

The root `server.js` is an ESM module that:
- Uses `createRequire` to import CommonJS backend routes
- Connects to MongoDB lazily (middleware-based)
- Serves the frontend build as static files
- Conditionally starts listening (skipped on Vercel)

---

## 11. Environment Variables

### Required

| Variable | Where | Description |
|----------|-------|-------------|
| `MONGODB_URI` | Root `.env` | MongoDB Atlas connection string |
| `MONGO_URI` | Root `.env` | Alternate MongoDB URI |
| `JWT_SECRET` | Root `.env` | JWT signing secret |
| `VITE_API_URL` | Frontend `.env` | API base URL (`/api`) |

### Optional (for full features)

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Stripe payment processing |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook verification |
| `STRIPE_PUBLISHABLE_KEY` | Stripe client-side key |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `SMTP_HOST` | Email SMTP host |
| `SMTP_PORT` | Email SMTP port |
| `SMTP_USER` | Email SMTP user |
| `SMTP_PASS` | Email SMTP password |
| `FROM_EMAIL` | Sender email address |
| `FROM_NAME` | Sender name |
| `CLIENT_URL` | Frontend URL for CORS |

---

## NPM Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Frontend dev server only |
| `dev:backend` | `node backend/src/server.js` | Backend dev server only |
| `dev:frontend` | `cd frontend && vite` | Frontend dev server only |
| `dev:full` | `concurrently "npm run dev:backend" "npm run dev:frontend"` | Both servers |
| `start` | `node server.js` | Production server |
| `build` | `cd frontend && vite build` | Build frontend |
| `lint` | `eslint src --ext js,jsx` | Lint frontend |

---

## Partners

9 airline/travel partners with their own pages:

| Partner | Tagline | Website |
|---------|---------|---------|
| Air Tanzania | The Wings of Kilimanjaro | airtanzania.co.tz |
| Kenya Airways | The Pride of Africa | kenya-airways.com |
| South African Airways | The Wings of Africa | flysaa.com |
| Emirates | Fly Better | emirates.com |
| Ethiopian Airlines | The New Spirit of Africa | ethiopianairlines.com |
| Qatar Airways | Going Places Together | qatarairways.com |
| Flightlink | Dreams Delivered | flightlink.co.tz |
| Auric Air | Tanzania's Premier Safari Carrier | auricair.com |
| Satguru Travels | 360° Travel Solutions | satgurutravel.com |

---

## License

Private — Zeno Africa Adventures. All rights reserved.
