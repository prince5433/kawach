# 🛡️ KAWACH — Complete Interview Preparation Guide

> **Bhai, ye guide padh le 2-3 ghante mein — interview ace kar dega! 🚀**
> Sab kuch Hinglish mein hai taaki jaldi samajh aaye.

---

## 📑 Table of Contents

1. [Project Ka Ek-Line Summary](#1-project-ka-ek-line-summary)
2. [Problem Statement (Kya Problem Solve Kar Rahe Ho)](#2-problem-statement)
3. [Solution (Kawach Kaise Solve Karta Hai)](#3-solution)
4. [Tech Stack Explained](#4-tech-stack-explained)
5. [Complete Architecture](#5-complete-architecture)
6. [Folder Structure](#6-folder-structure)
7. [File-by-File Explanation](#7-file-by-file-explanation)
8. [Complete User Flow (Step by Step)](#8-complete-user-flow)
9. [API Endpoints Summary](#9-api-endpoints-summary)
10. [Database Schema (Models)](#10-database-schema)
11. [Security Features](#11-security-features)
12. [Key Concepts Used](#12-key-concepts-used)
13. [Interview Questions & Answers (50+)](#13-interview-questions--answers)
14. [Quick Revision Cheat Sheet](#14-quick-revision-cheat-sheet)
15. [Common Follow-Up Questions](#15-common-follow-up-questions)
16. [Last Minute Tips](#16-last-minute-tips)

---

# 1. Project Ka Ek-Line Summary

> **Kawach ek MERN stack web application hai jo users ko securely documents share karne deta hai via one-time QR codes, jo 20 seconds baad auto-expire ho jaate hain aur file delete ho jaati hai.**

Interviewer ko agar ek line mein bolna ho:

> *"Kawach is a secure document sharing platform built on MERN stack where users upload documents, get a one-time QR code, the print shop scans it to print, and the file auto-deletes after 20 seconds — ensuring zero data retention."*

---

# 2. Problem Statement

## Real-World Problem:
Jab tum kisi **cafe/print shop** pe jaate ho apna **Aadhaar, PAN card, ya koi document print** karwane:

1. 📂 Tum file dete ho (pen drive / WhatsApp se)
2. 🖥️ Cafe wala apne computer pe save karta hai
3. 🖨️ Print karta hai
4. ❌ **File delete nahi karta** — unke system mein padi rehti hai
5. ⚠️ Tumhari personal info **misuse** ho sakti hai — sell, share, identity theft

**Ye ek massive privacy problem hai** — aur Kawach isi ko solve karta hai!

---

# 3. Solution

Kawach ka flow:

```
User Upload → File goes to Cloudinary → QR Code Generate → Shop Scans QR
→ Print hota hai → 20 sec baad QR Expire → File Auto-Delete ✅
```

### Key Points:
- ✅ File **Cloudinary cloud** pe store hoti hai (server pe nahi)
- ✅ **One-time QR code** generate hota hai
- ✅ **20 seconds** baad QR expire → file **automatically delete** 
- ✅ Print shop wala sirf **print** kar sakta hai, **download nahi**
- ✅ **Right-click, Ctrl+S, Ctrl+P, Dev tools** sab **disabled** hai print page pe
- ✅ Print hone ke baad window **auto-close** ho jaata hai

---

# 4. Tech Stack Explained

| Technology | Category | Kya kaam karta hai | Interview mein kya bolna hai |
|---|---|---|---|
| **React.js** | Frontend Library | UI components banana | "Component-based architecture use ki hai for reusable UI" |
| **Vite** | Build Tool | Dev server + bundling | "CRA se fast hai, HMR support hai, ES modules use karta hai" |
| **Tailwind CSS** | CSS Framework | Styling | "Utility-first CSS framework, rapid prototyping ke liye" |
| **Node.js** | Runtime | Backend chalana | "JavaScript server-side run karne ke liye V8 engine use karta hai" |
| **Express.js** | Backend Framework | Routes + API | "Lightweight framework, middleware pattern follow karta hai" |
| **MongoDB** | Database | Data store | "NoSQL database, flexible schema, JSON-like documents" |
| **Mongoose** | ODM | MongoDB se baat | "Schema validation aur model-based queries provide karta hai" |
| **Cloudinary** | Cloud Storage | Files store | "Third-party cloud for images/files, CDN built-in hai" |
| **JWT** | Auth Token | User identify | "Stateless authentication, token mein user ID encoded hoti hai" |
| **bcrypt** | Hashing | Password secure | "Salt rounds use karke password hash karta hai, one-way hashing" |
| **Multer** | Middleware | File upload | "multipart/form-data handle karta hai, file upload ke liye" |
| **multer-storage-cloudinary** | Storage Engine | Direct Cloudinary upload | "Multer ko Cloudinary se connect karta hai, seedha cloud pe upload" |
| **QRCode** | Library | QR generate | "URL ko QR code image mein convert karta hai" |
| **GSAP** | Animation | UI animations | "Professional-grade animation library, timeline-based" |
| **Axios** | HTTP Client | API calls | "Promise-based HTTP client, interceptors support karta hai" |
| **CORS** | Middleware | Cross-origin | "Frontend-Backend different ports pe hai, CORS allow karta hai" |
| **Morgan** | Middleware | Logging | "HTTP request logger, development mein debugging ke liye" |

---

# 5. Complete Architecture

```
┌──────────────────────────────────────────────────────┐
│                  CLIENT (React + Vite)                │
│                                                       │
│  Pages:  Home │ Login │ SignUp │ Dashboard │           │
│          GenerateQR │ Print                           │
│                                                       │
│  Components: ProtectedRoute │ Animate                 │
│  Context:    AuthContext (user state + token)          │
│                                                       │
│  axios → baseURL = VITE_BACKEND_API                  │
└──────────────────┬───────────────────────────────────┘
                   │  HTTP Requests (REST API)
                   │  Authorization: Bearer <JWT Token>
                   ▼
┌──────────────────────────────────────────────────────┐
│                 SERVER (Node.js + Express)            │
│                                                       │
│  server.js (Entry Point)                              │
│    ├── CORS, JSON parser, Morgan                     │
│    ├── /api/v1/auth   → authRoutes                   │
│    ├── /api/v1/file   → fileRoutes                   │
│    └── /api/v1/print  → printRoutes                  │
│                                                       │
│  Middlewares:                                         │
│    ├── authMiddleware (JWT verify)                    │
│    └── multer (file upload → Cloudinary)             │
│                                                       │
│  Controllers:                                         │
│    ├── authController (register/login)                │
│    └── qrcodeController (QR generate)                 │
│                                                       │
│  Models: userModel │ fileModel │ qrModel              │
│  Utils:  cloudinary.js (upload/delete)                │
│  Helper: authHelper.js (hash/compare password)        │
│  Config: db.js (MongoDB connection)                   │
└──────────┬────────────────────┬───────────────────────┘
           │                    │
           ▼                    ▼
    ┌──────────┐        ┌──────────────┐
    │ MongoDB  │        │  Cloudinary  │
    │ Atlas    │        │  (Cloud)     │
    │          │        │              │
    │ Users    │        │  /uploads/   │
    │ Files    │        │  /qrcodes/   │
    │ QRCodes  │        │              │
    └──────────┘        └──────────────┘
```

---

# 6. Folder Structure

```
kawach/
├── client/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── main.jsx                 # Entry point, AuthProvider wrap, axios config
│   │   ├── App.jsx                  # React Router setup, all routes define
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global state: user, login, logout, fileId
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx   # Auth guard: redirect to /login if no user
│   │   │   └── Animate.jsx          # Background gradient animation blobs
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Landing page with features + GSAP animations
│   │   │   ├── Login.jsx            # Login form → POST /api/v1/auth/login
│   │   │   ├── SignUp.jsx           # Signup form → POST /api/v1/auth/register
│   │   │   ├── Dashboard.jsx        # File upload (drag & drop + click) → Upload API
│   │   │   ├── GenerateQR.jsx       # QR code display + 20s countdown timer
│   │   │   └── Print.jsx            # Print page (QR scan se open), security locks
│   │   ├── assets/                  # Logo SVG, images
│   │   ├── index.css                # Base Tailwind imports
│   │   └── App.css                  # Custom styles
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.js           # Tailwind configuration
│   └── .env                         # VITE_BACKEND_API=http://localhost:8080
│
├── server/                          # Backend (Node.js + Express)
│   ├── server.js                    # Entry: Express app, middleware, routes, listen
│   ├── config/
│   │   └── db.js                    # MongoDB connection via mongoose
│   ├── models/
│   │   ├── userModel.js             # User schema: name, email, password, phone
│   │   ├── fileModel.js             # File schema: filename, path, mimetype, user, PublicId
│   │   └── qrModel.js              # QR schema: fileId, qrCode URL, fileUrl
│   ├── controllers/
│   │   ├── authController.js        # register + login logic with JWT
│   │   └── qrcodeController.js      # QR code generation + Cloudinary upload
│   ├── routes/
│   │   ├── authRoutes.js            # POST /register, POST /login
│   │   ├── fileRoutes.js            # POST /upload, GET /qrcode/:fileId, DELETE /delete/:fileId
│   │   └── printRoutes.js           # GET /:fileId (fetch file for printing)
│   ├── middlewares/
│   │   ├── authMiddleware.js        # JWT token verify → req.user set karta hai
│   │   └── multer.js                # Multer + CloudinaryStorage config
│   ├── helper/
│   │   └── authHelper.js            # bcrypt hash & compare functions
│   ├── utils/
│   │   └── cloudinary.js            # Cloudinary config, upload QR buffer, delete file
│   ├── package.json                 # Backend dependencies
│   └── .env                         # PORT, MONGO_URL, JWT_SECRET, Cloudinary keys
│
├── README.md                        # Project documentation
├── LICENSE                          # MIT License
└── PROJECT.md                       # Detailed project documentation (Hinglish)
```

---

# 7. File-by-File Explanation

## 🔵 SERVER FILES

### 7.1 `server.js` — Entry Point
```
Kya karta hai: Express app create karta hai, sab middleware lagata hai, routes connect karta hai, server start karta hai.
```

| Line | Kya ho raha hai |
|---|---|
| `import express` | Express framework import |
| `import cors` | Cross-Origin Resource Sharing allow karne ke liye |
| `import morgan` | HTTP request logging (dev mode mein) |
| `app.use(cors({origin: true, credentials: true}))` | Sab origins se request allow |
| `app.use(express.json())` | JSON body parse karna |
| `app.use(express.urlencoded({extended: true}))` | URL-encoded form data parse |
| `connectDb()` | MongoDB se connect |
| `app.use("/api/v1/auth", authRoutes)` | Auth routes mount |
| `app.use("/api/v1/file", fileRoutes)` | File routes mount |
| `app.use("/api/v1/print", printRoutes)` | Print routes mount |
| `app.listen(PORT)` | Server start on PORT 8080 |

---

### 7.2 `config/db.js` — Database Connection
```
Kya karta hai: MongoDB Atlas se connect karta hai using mongoose.
```
- `dns.setServers(['8.8.8.8'])` → Google DNS use karta hai (kuch networks pe MongoDB connect nahi hota without this)
- `mongoose.connect(process.env.MONGO_URL)` → Connection string .env se aata hai

---

### 7.3 `models/userModel.js` — User Schema
```javascript
// Fields:
name     → String, required, trim
email    → String, required, unique
password → String, required (stored as bcrypt hash)
phone    → String, required
timestamps → true (auto createdAt, updatedAt)
```
**Interview Point:** Password plain text mein store nahi hota, bcrypt se hash karke store karte hain.

---

### 7.4 `models/fileModel.js` — File Schema
```javascript
// Fields:
filename  → String (original file name)
path      → String (Cloudinary URL of the file)
content   → Buffer (optional, not used currently)
mimetype  → String (e.g., "image/png", "application/pdf")
size      → Number (file size in bytes)
uploadDate → Date (default: Date.now)
user      → ObjectId, ref: 'User' (kon user ne upload kiya)
PublicId  → String (Cloudinary public ID for deletion)
```
**Interview Point:** `user` field mein ObjectId store hota hai jo `ref: 'User'` se User model ko reference karta hai — ye **Mongoose population** ke liye hai.

---

### 7.5 `models/qrModel.js` — QR Code Schema
```javascript
// Fields:
fileId    → ObjectId, ref: 'File' (kis file ka QR hai)
qrCode    → String (QR code image ka Cloudinary URL)
fileUrl   → String (original file ka access URL)
createdAt → Date (default: Date.now)
```
**Interview Point:** QR code bhi Cloudinary pe store hota hai as an image — `qrCode` field mein uska URL hai.

---

### 7.6 `controllers/authController.js` — Register & Login

#### Register Flow:
```
1. req.body se name, email, password, phone extract
2. Validation check (sab required fields present?)
3. Check if user already exists (findOne by email)
4. hashPassword(password) → bcrypt se hash
5. new userModel({...}).save() → MongoDB mein save
6. res.status(201) → success response
```

#### Login Flow:
```
1. req.body se email, password extract
2. Validation check
3. userModel.findOne({email}) → user dhundho
4. comparePassword(password, user.password) → bcrypt compare
5. JWT.sign({_id: user._id}, JWT_SECRET, {expiresIn: "2h"}) → Token create
6. res.send({user, token}) → Client ko bhejo
```

**Interview Point:** JWT token mein sirf `_id` store hoti hai, expire time 2 hours hai. Token client localStorage mein save hota hai.

---

### 7.7 `controllers/qrcodeController.js` — QR Code Generation

```
Flow:
1. fileId aur fileUrl receive karo (fileUrl = frontend print page URL)
2. QRCode.toBuffer(fileUrl) → QR code as PNG buffer
3. uploadQRCodeBuffer(buffer) → Cloudinary pe upload
4. new QRModel({fileId, qrCode: cloudinaryURL, fileUrl}).save()
5. return cloudinaryURL
```

**Important:** QR code mein jo URL encode hota hai wo:
```
${FRONTEND_URL}/print/${fileId}
// Example: http://localhost:5173/print/6578abc123def
```

---

### 7.8 `routes/authRoutes.js`
```
POST /api/v1/auth/register → registerController
POST /api/v1/auth/login    → loginController
GET  /api/v1/auth/test     → isAuthenticated middleware → testController
```

---

### 7.9 `routes/fileRoutes.js` — Main Business Logic Routes

#### POST `/upload` (File Upload):
```
Middleware chain: isAuthenticated → upload.single('file')

Flow:
1. Auth check (JWT verify)
2. Multer + CloudinaryStorage → File directly upload to Cloudinary
3. FileModel create (filename, path=Cloudinary URL, PublicId, user)
4. generateQRCode(fileId, frontendPrintURL) → QR code bhi generate
5. Response: {fileId, fileUrl}
```

#### GET `/qrcode/:fileId` (Fetch QR Code):
```
1. Auth check
2. Verify file belongs to user (ownership check!)
3. QRModel.findOne({fileId}) → QR code URL fetch
4. Response: {qrCode URL, fileName, uploadDate}
```

#### DELETE `/delete/:fileId` (Delete File + QR):
```
1. Auth check
2. Verify ownership
3. deleteFileFromCloudinary(PublicId) → Cloudinary se delete
4. QRModel.findOneAndDelete({fileId}) → QR record delete
5. FileModel.findByIdAndDelete(fileId) → File record delete
```

---

### 7.10 `routes/printRoutes.js` — Print Access
```
GET /api/v1/print/:fileId

1. Auth check
2. FileModel.findById(fileId)
3. Response: {url: file.path, filename, mimetype}
```

---

### 7.11 `middlewares/authMiddleware.js` — JWT Verification
```javascript
// Kya karta hai:
1. req.headers.authorization se token extract ("Bearer <token>")
2. jwt.verify(token, JWT_SECRET) → decoded payload
3. req.user = decode → {_id: "user_id_here"}
4. next() → agle middleware/controller ko pass
```
**Interview Point:** Har protected route pe ye middleware lagta hai. Agar token invalid ya expired hai toh 401 error.

---

### 7.12 `middlewares/multer.js` — File Upload Config
```javascript
// CloudinaryStorage use karta hai:
- folder: "uploads" (Cloudinary pe folder name)
- allowed_formats: ["jpg", "jpeg", "png", "pdf", "doc", "docx"]
- public_id: random hex + original filename (unique name)
- fileSize limit: 10MB
```
**Interview Point:** Multer normally disk pe save karta hai, but `multer-storage-cloudinary` directly Cloudinary pe upload karta hai — server pe koi file save nahi hoti!

---

### 7.13 `helper/authHelper.js` — Password Hashing
```javascript
hashPassword(password):
  - saltRounds = 10
  - bcrypt.hash(password, 10) → hashed password return

comparePassword(password, hashedPassword):
  - bcrypt.compare(password, hashedPassword) → true/false
```

---

### 7.14 `utils/cloudinary.js` — Cloud File Management
```javascript
// 3 functions:

1. cloudinary.config({...}) → Cloudinary credentials set

2. uploadQRCodeBuffer(buffer):
   - Buffer → Base64 string → data URI
   - cloudinary.uploader.upload(dataURI, {folder: "qrcodes"})
   - Return: Cloudinary URL of QR code image

3. deleteFileFromCloudinary(publicId):
   - Try delete as image first
   - If fails, try delete as raw file
   - Both try karke file delete karta hai
```

---

## 🟢 CLIENT FILES

### 7.15 `main.jsx` — React Entry Point
```javascript
- AuthProvider wrap karta hai puri app ko (global state available)
- axios.defaults.baseURL = VITE_BACKEND_API (sab API calls ka base URL)
- axios.defaults.withCredentials = true (cookies/credentials bhejne ke liye)
```

### 7.16 `App.jsx` — Router Setup
```
Routes:
/              → Home (public)
/login         → Login (public)
/signup        → SignUp (public)
/dashboard     → Dashboard (ProtectedRoute → login required)
/generate-qr   → GenerateQR (ProtectedRoute → login required)
/print/:fileId → Print (public — QR scan se koi bhi access kare)
*              → Home (fallback — 404 handling)
```
**Interview Point:** `createBrowserRouter` use kiya hai (React Router v6.4+), `ProtectedRoute` wrapper component hai jo check karta hai user logged in hai ya nahi.

### 7.17 `context/AuthContext.jsx` — Global State Management
```javascript
// State:
- user → currently logged in user data (null if not logged in)
- fileId → recently uploaded file ka ID

// Functions:
- login(userData, token) → user set + token localStorage mein save
- logout() → user null + token remove from localStorage
- setFile(id) → fileId set (dashboard → generateQR page ke beech data pass)

// useAuth() hook → koi bhi component se access kar sakte ho
```
**Interview Point:** Context API use kiya hai Redux ki jagah kyunki app chhota hai, sirf user auth state manage karna tha.

### 7.18 `components/ProtectedRoute.jsx` — Auth Guard
```javascript
// Simple logic:
if (user exists) → render children (Dashboard/GenerateQR)
else → Navigate to /login

// Usage: <ProtectedRoute><Dashboard /></ProtectedRoute>
```

### 7.19 `components/Animate.jsx` — Background Effects
```
Kya karta hai: 2 gradient blobs (blue-purple, cyan-blue) with blur + pulse animation
→ Background pe floating glow effect deta hai
→ Har page pe use hota hai for premium look
```

### 7.20 `pages/Home.jsx` — Landing Page
```
Sections:
1. Logo + "KAWACH" title with gradient text
2. Hero Section: Shield icon, tagline, Login/Signup buttons
3. Features Section: 3 cards (Password Protection, Encryption, Privacy)
4. Stats Section: 99.99% Uptime, 1M+ Files, 24/7 Monitoring

GSAP Animations:
- Logo slides in from top
- Title slides from left
- Hero text slides up with stagger
- Feature cards slide up with stagger
- Stats scale up with bounce effect
```

### 7.21 `pages/Login.jsx` — Login Page
```
1. Form: Email + Password
2. GSAP animation: Card slides up, form elements stagger in
3. handleSubmit():
   - POST /api/v1/auth/login with {email, password}
   - Success → login(user, token) + navigate('/dashboard')
   - Error → toast notification
4. Links: "Forgot password?" + "Create secure account"
```

### 7.22 `pages/SignUp.jsx` — Signup Page
```
1. Form: Name + Email + Password + Phone
2. handleSubmit():
   - POST /api/v1/auth/register with {name, email, password, phone}
   - Success → toast + navigate('/dashboard')
```

### 7.23 `pages/Dashboard.jsx` — Main Upload Page
```
Features:
1. Navbar: Kawach logo, user email display, Logout button
2. File Upload Zone:
   - Drag & Drop support (dragenter, dragleave, dragover, drop events)
   - Click to select file (hidden input + label trick)
3. handleUpload(file):
   - FormData create → file append
   - POST /api/v1/file/upload (with JWT token in header)
   - Success → setFile(fileId) + navigate('/generate-qr')
4. Security Message Section (GSAP animated)
```

### 7.24 `pages/GenerateQR.jsx` — QR Code Display
```
Flow:
1. User clicks "Generate QR Code" button
2. GET /api/v1/file/qrcode/${fileId} → QR code URL fetch
3. QR code image display with glow effects
4. 20-second countdown timer starts
5. Timer display: progress bar + seconds counter
6. When timer hits 0:
   - handleQRExpiration() called
   - DELETE /api/v1/file/delete/${fileId}
   - File + QR deleted from Cloudinary + MongoDB
   - Navigate back to Dashboard
   - Toast: "QR Code has expired and file has been deleted"
```

### 7.25 `pages/Print.jsx` — Print Page (Shop Owner Access)
```
Security Measures:
1. Right-click disabled (contextmenu event blocked)
2. Keyboard shortcuts blocked (Ctrl+S, Ctrl+P, Ctrl+C, F12, Dev tools)
3. Text selection disabled (selectstart blocked)
4. Drag disabled (dragstart blocked)

Flow:
1. fileId URL params se extract
2. GET /api/v1/print/${fileId} → file data fetch
3. "Print Document" button click → handlePrint()
4. New window open → document image load → window.print() auto call
5. After print → window auto-close → redirect to /dashboard
```

---

# 8. Complete User Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     COMPLETE USER JOURNEY                    │
└─────────────────────────────────────────────────────────────┘

Step 1: User visits Home page (/)
        ↓ Clicks "Secure Login" or "Join Securely"

Step 2: User Registers (/signup)
        → POST /api/v1/auth/register
        → Password bcrypt se hash → MongoDB mein save
        ↓

Step 3: User Logs In (/login)
        → POST /api/v1/auth/login
        → bcrypt.compare → JWT token create → Client ko bhejo
        → Token localStorage mein save
        → AuthContext mein user set
        ↓

Step 4: Dashboard (/dashboard) — Protected Route
        → User drags/selects a file
        → FormData mein file + JWT token in header
        → POST /api/v1/file/upload
        ↓
        Server pe:
        → authMiddleware JWT verify → req.user set
        → Multer + CloudinaryStorage → File Cloudinary pe upload
        → FileModel save (with Cloudinary URL + PublicId)
        → QR code generate (URL: /print/{fileId})
        → QR code image Cloudinary pe upload
        → QRModel save
        ↓

Step 5: Generate QR Page (/generate-qr)
        → GET /api/v1/file/qrcode/{fileId}
        → QR code image display
        → 20-second countdown START ⏱️
        ↓

Step 6: Print Shop Owner scans QR code
        → Opens /print/{fileId} in browser
        → GET /api/v1/print/{fileId}
        → File details + Cloudinary URL receive
        → Clicks "Print Document"
        → New window → image load → auto print dialog
        ↓

Step 7: Timer expires (20 seconds)
        → DELETE /api/v1/file/delete/{fileId}
        → Cloudinary se file delete
        → MongoDB se File + QR records delete
        → User redirected to Dashboard
        → 🔒 FILE COMPLETELY DESTROYED — NO TRACE LEFT!
```

---

# 9. API Endpoints Summary

| Method | Endpoint | Auth? | Purpose | Request Body/Params |
|---|---|---|---|---|
| POST | `/api/v1/auth/register` | ❌ | User register | `{name, email, password, phone}` |
| POST | `/api/v1/auth/login` | ❌ | User login | `{email, password}` |
| GET | `/api/v1/auth/test` | ✅ | Test protected route | — |
| POST | `/api/v1/file/upload` | ✅ | File upload | `FormData with 'file'` |
| GET | `/api/v1/file/qrcode/:fileId` | ✅ | Get QR code | URL param: fileId |
| DELETE | `/api/v1/file/delete/:fileId` | ✅ | Delete file + QR | URL param: fileId |
| GET | `/api/v1/print/:fileId` | ✅ | Get file for print | URL param: fileId |

---

# 10. Database Schema

### Users Collection
```json
{
  "_id": "ObjectId",
  "name": "Prince Seth",
  "email": "prince@gmail.com",
  "password": "$2b$10$hashedPasswordHere...",  // bcrypt hash
  "phone": "9876543210",
  "createdAt": "2026-08-13T...",
  "updatedAt": "2026-08-13T..."
}
```

### Files Collection
```json
{
  "_id": "ObjectId",
  "filename": "aadhaar-card.pdf",
  "path": "https://res.cloudinary.com/.../uploads/abc123_aadhaar-card.pdf",
  "mimetype": "application/pdf",
  "size": 245678,
  "uploadDate": "2026-08-13T...",
  "user": "ObjectId(ref → Users)",    // Kis user ne upload kiya
  "PublicId": "uploads/abc123_aadhaar-card"  // For Cloudinary deletion
}
```

### QRCodes Collection
```json
{
  "_id": "ObjectId",
  "fileId": "ObjectId(ref → Files)",    // Kis file ka QR hai
  "qrCode": "https://res.cloudinary.com/.../qrcodes/qr_timestamp_random.png",
  "fileUrl": "http://localhost:5173/print/6578abc123",
  "createdAt": "2026-08-13T..."
}
```

---

# 11. Security Features

| Feature | Implementation | File |
|---|---|---|
| 🔐 Password Hashing | bcrypt with 10 salt rounds | `authHelper.js` |
| 🎫 JWT Authentication | Token-based, 2hr expiry | `authController.js` |
| 🛡️ Protected Routes | `isAuthenticated` middleware | `authMiddleware.js` |
| 👤 File Ownership | User ID check before access | `fileRoutes.js` |
| ⏱️ Auto-Expiry | 20-second QR code timer | `GenerateQR.jsx` |
| 🗑️ Auto-Delete | File + QR deleted after expiry | `GenerateQR.jsx` + `fileRoutes.js` |
| 🚫 Anti-Copy (Print Page) | Right-click, Ctrl+S/P/C, F12 blocked | `Print.jsx` |
| 🚫 Anti-Select | Text selection + drag disabled | `Print.jsx` |
| 🖨️ Print-Only | Auto-print dialog, window closes after | `Print.jsx` |
| ☁️ No Server Storage | Files go directly to Cloudinary (not server disk) | `multer.js` |
| 🔑 Bearer Token | All API calls carry `Authorization: Bearer <token>` | Client pages |

---

# 12. Key Concepts Used

### 12.1 MERN Stack
- **M**ongoDB → Database
- **E**xpress.js → Backend framework
- **R**eact.js → Frontend library
- **N**ode.js → Runtime environment

### 12.2 REST API Design
- `GET` → Read data
- `POST` → Create data
- `DELETE` → Remove data
- Versioned API: `/api/v1/...`

### 12.3 MVC Pattern (loosely)
- **Model** → `models/` folder (userModel, fileModel, qrModel)
- **Controller** → `controllers/` folder (authController, qrcodeController)
- **Routes** → `routes/` folder (routes connect URLs to controllers)
- (View is handled by React frontend)

### 12.4 JWT Authentication Flow
```
Login → Server creates JWT with user._id → Client stores in localStorage
→ Every API call: Authorization header with Bearer token
→ Server middleware verifies token → extracts user._id → req.user set
```

### 12.5 Middleware Pattern
```
Request → CORS → JSON Parser → Morgan Logger → Route Middleware (auth/multer) → Controller → Response
```

### 12.6 Context API (React)
```
AuthProvider wraps entire app → provides user, login, logout, fileId
→ Any component calls useAuth() to access global state
→ Alternative to Redux for small apps
```

### 12.7 React Router v6+
```
createBrowserRouter + createRoutesFromElements
→ ProtectedRoute component for auth guard
→ useNavigate() for programmatic navigation
→ useParams() for URL parameters (like fileId)
```

### 12.8 File Upload Pipeline
```
Client (FormData) → Multer middleware → CloudinaryStorage → Cloudinary cloud
→ req.file populated with Cloudinary response
→ Save metadata to MongoDB (FileModel)
```

---

# 13. Interview Questions & Answers

## 🟢 BASIC QUESTIONS (Project Overview)

### Q1: Kawach kya hai? Ek line mein batao.
**A:** Kawach ek MERN stack web app hai jo users ko documents securely share karne deta hai via one-time QR codes — jo 20 seconds baad expire ho jaate hain aur file automatically delete ho jaati hai.

---

### Q2: Kya problem solve karta hai ye project?
**A:** Jab hum cafe/print shop pe document print karwate hain, file unke system pe save reh jaati hai — privacy risk! Kawach mein file Cloudinary cloud pe jaati hai, QR code se sirf print hota hai, aur 20 sec baad file auto-delete ho jaati hai. Zero data retention.

---

### Q3: Tech stack kya use kiya hai?
**A:** Frontend mein React with Vite aur Tailwind CSS, Backend mein Node.js with Express.js, Database MongoDB with Mongoose ODM, File storage ke liye Cloudinary cloud, Authentication ke liye JWT + bcrypt, aur QR code generation ke liye QRCode library.

---

### Q4: Team mein kitne log the aur tumhara contribution kya tha?
**A:** 3 log — Sujal Raj, Prince Seth (main), aur Harsh Kumar. *(Apna specific contribution yahan add kar — frontend kiya ya backend ya dono.)*

---

### Q5: Project ka flow samjhao end-to-end.
**A:** User signup/login karta hai → Dashboard pe file upload karta hai (drag & drop) → File Cloudinary pe upload hoti hai + QR code generate hota hai → GenerateQR page pe QR dikhta hai with 20-second timer → Print shop wala QR scan karta hai → Print page open hota hai, "Print" button click → document print → Timer expire hone pe file + QR dono Cloudinary + MongoDB se delete ho jaate hain.

---

## 🔵 BACKEND QUESTIONS

### Q6: JWT kya hai aur kaise use kiya hai?
**A:** JWT (JSON Web Token) ek stateless authentication mechanism hai. Login ke time server `JWT.sign({_id: user._id}, JWT_SECRET, {expiresIn: "2h"})` se token banata hai. Ye token client ko milta hai, localStorage mein save hota hai. Har API call mein `Authorization: Bearer <token>` header mein bhejte hain. Server pe `authMiddleware` mein `jwt.verify()` se verify karte hain aur `req.user` mein decoded data set karte hain.

---

### Q7: bcrypt kya hai aur password kaise secure kiya hai?
**A:** bcrypt ek one-way hashing algorithm hai. Registration pe `bcrypt.hash(password, 10)` se password hash karte hain — 10 salt rounds use hote hain. Login pe `bcrypt.compare(plainPassword, hashedPassword)` se check karte hain. Password kabhi plain text mein store nahi hota. Hashing irreversible hai — hash se original password nahi nikal sakte.

---

### Q8: Multer kya hai aur kaise use kiya?
**A:** Multer ek Node.js middleware hai jo `multipart/form-data` handle karta hai — specifically file uploads ke liye. Normally Multer disk pe save karta hai, but humne `multer-storage-cloudinary` use kiya hai — toh file directly Cloudinary pe upload hoti hai, server disk pe kuch save nahi hota. `upload.single('file')` se single file upload handle hota hai.

---

### Q9: Cloudinary kya hai aur kyun use kiya?
**A:** Cloudinary ek cloud-based media management platform hai. Humne isko use kiya kyunki:
1. Files server pe store nahi karni thi (security reason)
2. CDN built-in hai toh files fast load hoti hain
3. Easy API hai upload/delete ke liye
4. Unique PublicId se file easily manage hoti hai
5. Free tier available hai

---

### Q10: Middleware kya hota hai Express mein?
**A:** Middleware ek function hai jo request aur response ke beech execute hota hai. `(req, res, next)` format mein hota hai. `next()` call karke agle middleware ya controller ko pass karta hai. Hamare project mein:
- `cors` → cross-origin requests allow
- `express.json()` → JSON body parse
- `morgan` → request logging
- `isAuthenticated` → JWT token verify
- `upload.single('file')` → file upload handle

---

### Q11: MongoDB mein ObjectId aur ref kya hai?
**A:** `ObjectId` MongoDB ka unique identifier hai (12-byte, auto-generated). `ref` Mongoose ka feature hai jo ek model ko doosre model se link karta hai. Jaise `fileModel` mein `user: { type: ObjectId, ref: 'User' }` — iska matlab ye file kis user ki hai. `populate()` se hum user ki full details fetch kar sakte hain instead of just ID.

---

### Q12: CORS kya hai aur kyun chahiye?
**A:** CORS (Cross-Origin Resource Sharing) browser ka security feature hai. Frontend `localhost:5173` pe hai aur Backend `localhost:8080` pe — ye different origins hain. Without CORS, browser API calls block kar dega. `cors({origin: true, credentials: true})` se sab origins se requests allow karte hain.

---

### Q13: Environment variables (.env) kyun use karte hain?
**A:** Sensitive data jaise MongoDB URL, JWT Secret, Cloudinary keys — ye code mein hardcode nahi karte. `.env` file mein rakhte hain aur `dotenv.config()` se load karte hain. `.gitignore` mein `.env` add karte hain taaki GitHub pe push na ho. Ye security best practice hai.

---

### Q14: Express mein route versioning kyun ki hai (/api/v1/)?
**A:** Route versioning se API backward compatible rehta hai. Agar future mein v2 banaye toh purane clients v1 use karte rahein. Ye industry standard practice hai.

---

## 🟡 FRONTEND QUESTIONS

### Q15: React mein Context API kya hai aur Redux se kya fark hai?
**A:** Context API React ka built-in state management hai. `createContext()` se context banate hain, `Provider` se wrap karte hain, `useContext()` se access karte hain. Redux ki jagah Context use kiya kyunki:
- App chhoti hai (sirf user auth state hai)
- Redux ka boilerplate bahut hota hai (actions, reducers, store)
- Context simple use cases ke liye perfect hai
- Large apps mein Redux better hai (performance + middleware support)

---

### Q16: ProtectedRoute component kaise kaam karta hai?
**A:** Bahut simple hai:
```jsx
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};
```
Agar `user` state mein user hai → children render (Dashboard/GenerateQR), nahi toh `/login` pe redirect. Ye ek **Higher-Order Component (HOC) pattern** hai.

---

### Q17: Drag and Drop kaise implement kiya?
**A:** HTML5 Drag and Drop API use ki:
1. `onDragEnter` → file drag karke area pe aaye toh `dragActive = true` (visual feedback)
2. `onDragOver` → area pe hover kar rahe toh event prevent (default open in browser ko rokna)
3. `onDragLeave` → area se bahar gaye toh `dragActive = false`
4. `onDrop` → file drop ki toh `e.dataTransfer.files[0]` se file extract → upload start
5. `e.preventDefault()` aur `e.stopPropagation()` dono zaroori hain

---

### Q18: GSAP kya hai aur kaise use kiya?
**A:** GSAP (GreenSock Animation Platform) ek professional animation library hai. CSS animations se better performance aur control deta hai. Humne use kiya:
- `gsap.timeline()` → multiple animations sequence mein
- `gsap.fromTo(element, from, to)` → start se end position
- `stagger` property → multiple elements mein delay
- Login/Signup cards slide up, hero text fade in, feature cards animate

---

### Q19: React Router v6 mein `createBrowserRouter` kya hai?
**A:** React Router v6.4+ ka naya API hai. `createBrowserRouter` se routes define karte hain `createRoutesFromElements` ke saath. Ye data router hai — loaders, actions support karta hai. Purana `<BrowserRouter><Routes>` ke comparison mein more powerful hai. `RouterProvider` se app mein inject karte hain.

---

### Q20: localStorage mein token store karna secure hai?
**A:** Completely secure nahi hai — XSS attack ho sakta hai. Better options:
1. **httpOnly cookies** → JavaScript access nahi kar sakta
2. **Refresh token pattern** → short-lived access token + httpOnly refresh token
3. But hamare project mein MVP ke liye localStorage use kiya — production mein httpOnly cookies better hain.

---

## 🔴 ADVANCED/DEEP DIVE QUESTIONS

### Q21: QR code mein kya encode hota hai?
**A:** QR code mein ek URL encode hota hai: `http://localhost:5173/print/{fileId}`. Jab print shop wala scan karta hai, ye URL browser mein open hota hai → Print page render hoti hai → file data API se fetch hota hai → print dialog open hota hai.

---

### Q22: File delete ka pura flow kya hai?
**A:** QR expire hone pe (20 sec):
1. Frontend `DELETE /api/v1/file/delete/{fileId}` call karta hai
2. Server ownership verify karta hai (file.user === req.user._id)
3. `deleteFileFromCloudinary(PublicId)` → Cloudinary se file delete
   - Pehle as image try karta hai
   - Fail hone pe as raw file try karta hai
4. `QRModel.findOneAndDelete({fileId})` → QR record delete from MongoDB
5. `FileModel.findByIdAndDelete(fileId)` → File record delete from MongoDB
6. Sab jagah se data hat gaya — **zero trace!**

---

### Q23: Print page pe security measures kaise implement kiye?
**A:** Multiple layers:
1. `contextmenu` event block → **right-click disabled**
2. `keydown` event catch → **Ctrl+S, Ctrl+P, Ctrl+C, Ctrl+V, Ctrl+Shift+I/J/C, F12** sab block
3. `selectstart` event block → **text select nahi hoga**
4. `dragstart` event block → **drag nahi hoga**
5. Print window mein bhi same restrictions + **afterprint** event pe window auto-close
6. Print hone ke baad `window.opener.location.href = '/dashboard'` → original page redirect

---

### Q24: Timer (countdown) kaise implement kiya hai?
**A:** `useEffect` + `setInterval` pattern:
```javascript
useEffect(() => {
  let timer;
  if (timerActive && timeLeft > 0) {
    timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleQRExpiration(); // Delete file + QR
          return 0;
        }
        return prev - 1;
      });
    }, 1000); // Every 1 second
  }
  return () => clearInterval(timer); // Cleanup on unmount
}, [timerActive, timeLeft]);
```

---

### Q25: Multer-storage-cloudinary kaise kaam karta hai internally?
**A:** Normal Multer disk/memory pe save karta hai. `multer-storage-cloudinary` ek custom storage engine hai:
1. File receive hoti hai multipart stream mein
2. CloudinaryStorage automatically Cloudinary API call karta hai
3. File upload hoti hai specified folder mein ("uploads")
4. Response mein `req.file.path` = Cloudinary URL, `req.file.filename` = Public ID
5. Server disk pe kuch nahi save hota — directly cloud pe!

---

### Q26: MongoDB mein NoSQL vs SQL ka fark kya hai?
**A:** 

| Feature | SQL (MySQL) | NoSQL (MongoDB) |
|---|---|---|
| Structure | Fixed schema, tables | Flexible schema, collections |
| Data Format | Rows & columns | JSON-like documents (BSON) |
| Relationships | JOIN queries | Embedding or referencing (ObjectId + ref) |
| Scaling | Vertical (bigger server) | Horizontal (add more servers) |
| Best For | Complex relationships | Flexible, rapidly changing data |

Humne MongoDB use kiya kyunki documents ka structure flexible hai aur MERN stack naturally support karta hai.

---

### Q27: Vite aur Create React App (CRA) mein kya fark hai?
**A:**

| Feature | CRA | Vite |
|---|---|---|
| Bundler | Webpack | esbuild + Rollup |
| Dev Server Speed | Slow (full bundle) | Instant (ES modules) |
| HMR | Slow | Blazing fast |
| Build Size | Larger | Smaller |
| Config | Hidden (eject needed) | Simple vite.config.js |

Vite use kiya kyunki dev server instantly start hota hai aur HMR (Hot Module Replacement) super fast hai.

---

### Q28: Mongoose mein `timestamps: true` kya karta hai?
**A:** Automatically 2 fields add karta hai schema mein:
- `createdAt` → document kab create hua
- `updatedAt` → document kab last update hua
Manually manage nahi karna padta — Mongoose khud handle karta hai.

---

### Q29: `express.json()` aur `express.urlencoded()` kya karte hain?
**A:**
- `express.json()` → JSON format ka request body parse karta hai (`Content-Type: application/json`)
- `express.urlencoded({extended: true})` → URL-encoded form data parse karta hai (`Content-Type: application/x-www-form-urlencoded`)
- Without these, `req.body` undefined hoga!

---

### Q30: Error handling kaise kiya hai project mein?
**A:** Try-catch blocks use kiye hain har controller/route mein:
```javascript
try {
  // Main logic
  res.status(200).send({ success: true, ... });
} catch (error) {
  console.error('Error:', error);
  res.status(500).send({ success: false, message: "Error message", error: error.message });
}
```
Frontend pe `toast.error()` se user ko friendly error messages dikhate hain.

---

### Q31: axios interceptors kya hote hain? Tumne use kiya?
**A:** Axios interceptors middleware ki tarah hain — har request/response ke beech run hote hain. Humne directly nahi use kiya, but `axios.defaults.baseURL` aur `axios.defaults.withCredentials` set kiya hai globally. Production mein interceptor se auto token refresh, error handling kar sakte hain.

---

### Q32: React mein `useRef` kya hai aur Dashboard mein kyun use kiya?
**A:** `useRef` ek hook hai jo DOM element ka direct reference deta hai — bina re-render ke. Dashboard mein `securityMessageRef` use kiya GSAP animation ke liye — GSAP ko actual DOM node chahiye animate karne ke liye, toh `ref` se access diya.

---

### Q33: FormData kya hai aur file upload mein kyun zaroori hai?
**A:** `FormData` ek JavaScript API hai jo `multipart/form-data` format mein data pack karta hai — files ke saath send karne ke liye mandatory hai. Normal JSON mein file nahi bhej sakte:
```javascript
const formData = new FormData();
formData.append('file', file); // 'file' naam se Multer pick karega
```
`Content-Type: multipart/form-data` header automatically set hota hai.

---

### Q34: `useEffect` cleanup function kya hai aur kyun zaroori hai?
**A:** `useEffect` ka return function cleanup karta hai jab component unmount hota hai ya dependency change hoti hai:
```javascript
useEffect(() => {
  const timer = setInterval(...);
  return () => clearInterval(timer); // CLEANUP!
}, []);
```
Without cleanup: memory leaks, timers background mein chalte rahenge, event listeners accumulate hote rahenge.

---

### Q35: `Bearer <token>` format kyun use karte hain?
**A:** Bearer token ek standard OAuth 2.0 authentication scheme hai. `Authorization: Bearer <token>` format industry standard hai. Server pe `req.headers.authorization.split(' ')[1]` se token extract karte hain. "Bearer" prefix batata hai ki ye ek bearer token hai — holder ke paas access hai.

---

## 🟣 ARCHITECTURE & DESIGN QUESTIONS

### Q36: MVC pattern follow kiya hai ya nahi?
**A:** Loosely MVC follow kiya hai:
- **Model** → `models/` folder (schema definitions)
- **Controller** → `controllers/` + `routes/` (business logic)
- **View** → React frontend (separate from backend)
Pure MVC nahi hai kyunki kuch business logic routes files mein hai (fileRoutes.js), but overall architecture clean hai.

---

### Q37: Agar production mein deploy karna ho toh kya changes karoge?
**A:**
1. **httpOnly cookies** use karna for JWT (localStorage se better)
2. **Rate limiting** add karna (too many requests block)
3. **Helmet.js** add karna (security headers)
4. **Input sanitization** (XSS/injection prevention)
5. **File type validation** server-side (mime type check)
6. **HTTPS** mandatory
7. **Environment-specific configs** (dev/staging/prod)
8. **Error monitoring** (Sentry)
9. **Database indexing** for better query performance
10. **Server-side QR expiry** (not just client-side timer)

---

### Q38: Client-side timer se file delete karna secure hai?
**A:** **Nahi, ye weakness hai!** Client-side timer easily bypass ho sakta hai (browser console, network manipulation). Better approach:
- **TTL Index** MongoDB mein → documents auto-expire after specified time
- **Cron job** server pe → periodically expired files check & delete
- **Server-side timer** → `setTimeout` on server after upload
- But MVP ke liye client-side approach use kiya hai — interview mein bolo ki "I'm aware of this limitation and would add server-side expiry in production."

---

### Q39: Scaling kaise karoge is project ko?
**A:**
1. **Load Balancer** → multiple server instances
2. **Redis** → session/cache management
3. **CDN** → static assets serve karna
4. **Database sharding** → MongoDB horizontal scaling
5. **Microservices** → auth, file, QR separate services
6. **Queue system** (Bull/RabbitMQ) → file processing async
7. **Docker + Kubernetes** → containerization

---

### Q40: Tumhara project mein sabse challenging part kya tha?
**A:** *(Apne experience ke hisaab se customize kar, ye examples hain:)*
- "File upload pipeline setup karna — Multer ko Cloudinary se connect karna initially tricky tha. Storage engine concept samajhna padha."
- "QR code generation aur print page ka security implement karna — multiple browser events handle karne padhe."
- "Timer-based auto-deletion ka flow — client aur server dono ko sync mein rakhna."

---

## 🟠 CONCEPTUAL QUESTIONS (General Tech)

### Q41: REST API ke principles kya hain?
**A:**
1. **Client-Server** → frontend-backend separate
2. **Stateless** → har request independent, server state nahi rakhta (JWT isiliye use karte hain)
3. **Uniform Interface** → standard HTTP methods (GET, POST, PUT, DELETE)
4. **Resource-Based** → URLs resources represent karte hain (/api/v1/file, /api/v1/auth)

---

### Q42: HTTP Status Codes kaunse use kiye hain?
**A:**
- `200` → OK (success)
- `201` → Created (registration success)
- `400` → Bad Request (invalid token)
- `401` → Unauthorized (no token)
- `404` → Not Found (user/file not found)
- `500` → Internal Server Error (server crash)

---

### Q43: `async/await` kya hai aur kyun use kiya?
**A:** `async/await` Promises ka cleaner syntax hai. Database queries, API calls — sab asynchronous hain. Without async/await, nested `.then().catch()` chains ugly hoti hain. `await` waits for promise resolution, `try-catch` se error handle karte hain.

---

### Q44: Single Page Application (SPA) kya hai?
**A:** SPA mein sirf ek HTML page load hota hai. Navigation hone pe poora page reload nahi hota — sirf components change hote hain. React Router client-side routing karta hai. Benefits: faster navigation, better UX, less server load. Kawach ek SPA hai.

---

### Q45: `import.meta.env.VITE_BACKEND_API` kya hai?
**A:** Vite ka environment variables access karne ka tarika. Vite mein sirf `VITE_` prefix wale variables client mein accessible hote hain (security reason — sab env variables expose nahi karna chahte). `import.meta.env` ES modules ka standard hai.

---

## 🟤 SCENARIO-BASED QUESTIONS

### Q46: Agar user ne file upload ki but QR generate nahi kiya toh?
**A:** File Cloudinary + MongoDB mein save reh jaayegi. Ideally server-side TTL ya cron job se ye orphan files clean karni chahiye. Hamare current implementation mein ye ek limitation hai — QR generation automatically upload ke saath hoti hai toh ye scenario usually nahi aata.

---

### Q47: Agar 2 users same file upload karein toh?
**A:** Koi problem nahi. Har file ka unique `_id` hota hai MongoDB mein, aur Cloudinary pe unique PublicId (random hex + filename). Dono users ki files alag stored hain, alag QR codes hain. `user` field se ownership track hota hai.

---

### Q48: Agar Cloudinary down ho jaaye toh?
**A:** File upload fail ho jaayega kyunki Multer storage Cloudinary pe depend karta hai. Error catch hoga try-catch mein aur user ko "Error uploading file" toast dikhega. Production mein:
- Fallback storage (AWS S3)
- Retry mechanism
- Circuit breaker pattern

---

### Q49: QR code expire hone se pehle koi save/screenshot le le toh?
**A:** URL toh save ho sakta hai (screenshot/manual copy), but:
- File 20 sec baad delete ho jaayegi Cloudinary se
- Toh URL access karne pe file nahi milegi
- MongoDB se bhi record delete ho jaayega
- Print page pe right-click + keyboard shortcuts blocked hain

---

### Q50: Token expire hone pe kya hota hai?
**A:** JWT 2 hours ke liye valid hai. Expire hone pe:
- `jwt.verify()` fail hoga → error throw
- authMiddleware 400 status return karega ("Invalid token")
- Frontend pe 401 response milne pe user ko login page pe redirect karna chahiye
- User ko dobara login karna padega

---

## 🔵 BONUS QUESTIONS (Impress the Interviewer!)

### Q51: Ye project mein kya improve karoge?
**A:**
1. **Server-side TTL expiry** — MongoDB TTL index for auto document deletion
2. **End-to-end encryption** — AES encryption before upload
3. **Rate limiting** — brute force protection
4. **Email OTP verification** — signup pe
5. **File preview** — before upload
6. **Download count tracking** — analytics
7. **Admin dashboard** — all users/files manage
8. **WebSocket notifications** — real-time QR scan alert
9. **PWA support** — mobile-friendly, offline capable
10. **Watermarking** — documents pe user-specific watermark

---

### Q52: MongoDB TTL Index kya hai aur kaise use karte?
**A:** TTL (Time-To-Live) Index automatically documents delete karta hai specified time ke baad:
```javascript
// In qrModel.js:
createdAt: { type: Date, default: Date.now, expires: 20 } // 20 seconds!
```
MongoDB background thread check karta hai — jab `createdAt + 20sec` pass ho jaaye, document auto-delete. Ye server-side solution hai — client timer bypass hone pe bhi file delete ho jaayegi.

---

### Q53: Kabhi `populate()` use kiya hai Mongoose mein?
**A:** Current code mein directly use nahi kiya but ye concept samajhte hain. `populate()` se ObjectId reference ko actual document se replace kar sakte hain:
```javascript
const file = await FileModel.findById(id).populate('user');
// file.user = { _id, name, email, phone } instead of just ObjectId
```

---

### Q54: React mein `useCallback` aur `useMemo` kab use karte hain?
**A:** `useCallback` functions ko memoize karta hai (re-render pe naya function nahi banta), `useMemo` values ko memoize karta hai. Heavy computations ya child components ke unnecessary re-renders rokne ke liye. Hamare project mein required nahi tha kyunki components complex nahi hain.

---

### Q55: Tailwind CSS ke benefits kya hain vanilla CSS se?
**A:**
1. No separate CSS files — classes directly HTML mein
2. Rapid prototyping — pre-built utility classes
3. Consistent design — spacing, colors predefined
4. Responsive design easy — `md:`, `lg:` prefixes
5. PurgeCSS built-in — unused CSS remove for production
6. Downside: HTML verbose ho jaata hai

---

---

# 14. Quick Revision Cheat Sheet

## 🗂️ File → Purpose Map (30 Seconds Revision)

| File | Ek Line Summary |
|---|---|
| `server.js` | Express app create, middleware, routes, server start |
| `db.js` | MongoDB Atlas se connect |
| `userModel.js` | User schema: name, email, hashed password, phone |
| `fileModel.js` | Uploaded file metadata + Cloudinary URL + PublicId |
| `qrModel.js` | QR code data: fileId, QR image URL, file URL |
| `authController.js` | Register (hash password) + Login (compare + JWT) |
| `qrcodeController.js` | QR code generate as PNG → upload to Cloudinary |
| `authRoutes.js` | `/register`, `/login` endpoints |
| `fileRoutes.js` | `/upload`, `/qrcode/:id`, `/delete/:id` endpoints |
| `printRoutes.js` | `/:fileId` — fetch file details for printing |
| `authMiddleware.js` | JWT token verify → req.user set |
| `multer.js` | File upload → directly to Cloudinary (not server disk) |
| `authHelper.js` | bcrypt hash & compare password |
| `cloudinary.js` | Cloudinary config + upload QR + delete file |
| `main.jsx` | React entry, AuthProvider wrap, axios baseURL |
| `App.jsx` | React Router: all routes + ProtectedRoute |
| `AuthContext.jsx` | Global state: user, login, logout, fileId |
| `ProtectedRoute.jsx` | Auth guard: no user → redirect to login |
| `Animate.jsx` | Background gradient blobs (CSS animation) |
| `Home.jsx` | Landing page + GSAP animations |
| `Login.jsx` | Login form → API call → store token |
| `SignUp.jsx` | Signup form → API call |
| `Dashboard.jsx` | Drag & drop file upload → navigate to QR page |
| `GenerateQR.jsx` | QR display + 20s timer + auto-delete on expiry |
| `Print.jsx` | Print page — security locks + auto-print + window close |

---

## 🔑 Key Numbers to Remember
- JWT expiry: **2 hours**
- QR expiry: **20 seconds**
- File size limit: **10 MB**
- bcrypt salt rounds: **10**
- Backend port: **8080**
- Frontend port: **5173**
- Cloudinary folders: **uploads/** (files), **qrcodes/** (QR images)

---

## 🎯 Key Buzzwords for Interview
- MERN Stack
- REST API
- JWT Authentication (Stateless)
- bcrypt Hashing (One-way, Salt rounds)
- Multer (multipart/form-data)
- Cloud Storage (Cloudinary CDN)
- Context API (Global State)
- Protected Routes (Auth Guard)
- One-time QR Code
- Auto-expiry & Auto-deletion
- Privacy-first approach
- Zero data retention

---

# 15. Common Follow-Up Questions

### "Tumne ye project mein kya sikha?"
> "Full-stack development ka real flow samjha — client-server communication, JWT authentication, cloud file management, aur security implementation. Sabse important — privacy by design approach samjhi."

### "Deployment kaise kiya?"
> "Frontend Vercel/Netlify pe deploy kar sakte hain, Backend Railway/Render pe. MongoDB Atlas already cloud pe hai, Cloudinary bhi cloud hai. Environment variables deployment platform pe set karte hain."

### "Koi bug ya issue face kiya tha?"
> "CORS issue initially aaya tha — frontend-backend different ports pe the. `cors({origin: true})` se solve kiya. Cloudinary deletion mein image vs raw file type issue aaya — dono try karna pada sequentially."

### "Testing kaise kiya?"
> "Manual testing kiya — Postman se API test, browser mein frontend test. Production mein Jest + React Testing Library + Supertest add karna chahiye."

---

# 16. Last Minute Tips

> [!IMPORTANT]
> ## Interview Day Checklist:
> 1. ✅ **Project locally run karke dikha** — live demo is the BEST proof
> 2. ✅ **README.md padh le** — project setup steps yaad hone chahiye
> 3. ✅ **Folder structure yaad rakh** — interviewer puche toh instantly bata sake
> 4. ✅ **Flow diagram yaad rakh** — Upload → QR → Print → Delete
> 5. ✅ **Limitations bhi bol** — shows maturity (client-side timer, localStorage token)
> 6. ✅ **Improvements bata** — shows forward thinking
> 7. ✅ **Confidently bol** — "Maine ye kiya", not "ye ho gaya tha"
> 8. ✅ **Ye phrases use kar:**
>    - "I designed this to..."
>    - "The reason we chose this approach was..."
>    - "One improvement I'd make in production is..."
>    - "This follows the middleware pattern because..."

> [!TIP]
> **Pro Tip:** Agar interviewer kuch pooche jo nahi aata, toh bol: *"I haven't implemented this in the current version, but I know the concept — [briefly explain]. I would add this in the next iteration."* Ye honesty + knowledge dono dikhata hai.

---

**All the best bhai! Tu ye interview crack kar dega! 🚀🔥**

*—  Guide generated from complete codebase analysis of Kawach project*
