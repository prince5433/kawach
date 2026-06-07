# 📖 KAWACH — Complete Project Documentation (Hinglish)

> **Note:** Ye document Hinglish (Hindi + English) mein likha gaya hai taaki tum easily samajh sako. Har file, har concept, har flow — sab kuch detail mein covered hai.

---

## 📑 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Folder Structure](#2-folder-structure)
3. [File-by-File Explanation](#3-file-by-file-explanation)
4. [Execution Flow](#4-execution-flow-most-important)
5. [Request Lifecycle](#5-request-lifecycle)
6. [Architecture Deep Dive](#6-architecture-deep-dive)
   - [Storage Breakdown — Kya Kahan Save Hai?](#-storage-breakdown--kya-kahan-save-hai)
   - [Multi-Actor Flow Diagrams](#-multi-actor-flow-diagrams)
7. [Important Concepts Used](#7-important-concepts-used)
8. [Learning Path](#8-learning-path)
9. [Dependency Graph](#9-dependency-graph)
10. [Interview Preparation](#10-interview-preparation) (Q1–Q10 + Q11–Q25 Deep Dive)
    - [Quick Revision Table](#-quick-revision-table--concept--file--kya-karta-hai)
11. [Code Walkthrough Notes](#11-code-walkthrough-notes)
12. [Improvements](#12-improvements)

---

# 1. Project Overview

## 🎯 Problem kya solve ho raha hai?

Socho tum ek cafe ya print shop par jaate ho apna Aadhaar card ya koi personal document print karwane. Tum apni file dete ho, wo log print karte hain — lekin **file unke computer mein save reh jaati hai**! Ab wo file kahi bhi share ho sakti hai, misuse ho sakti hai — aur tumhe pata bhi nahi chalega.

**Kawach** ye problem solve karta hai:
- Tum apna document **securely upload** karo
- Ek **QR code generate** hota hai (one-time use)
- Print shop wala QR scan karke **sirf print** kar sakta hai
- **20 seconds** baad QR code **expire** ho jaata hai aur file **automatically delete** ho jaati hai
- Koi bhi file save nahi kar sakta! 🔒

## 🏗 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     USER (Browser)                      │
│                                                         │
│   ┌──────────┐  ┌──────────┐  ┌───────────┐           │
│   │   Home   │  │  Login/  │  │ Dashboard │           │
│   │   Page   │  │  Signup  │  │  (Upload) │           │
│   └──────────┘  └──────────┘  └─────┬─────┘           │
│                                      │                  │
│   ┌──────────────┐    ┌──────────────┴───┐             │
│   │ GenerateQR   │    │   Print Page     │             │
│   │   Page       │    │ (QR scan se open)│             │
│   └──────────────┘    └──────────────────┘             │
│                                                         │
│              React + Vite + Tailwind CSS                │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP API Calls (axios)
                       ▼
┌──────────────────────────────────────────────────────────┐
│                   BACKEND SERVER                         │
│              Node.js + Express.js                        │
│                                                          │
│   ┌────────────┐  ┌───────────┐  ┌──────────────┐      │
│   │ Auth Routes│  │File Routes│  │ Print Routes │      │
│   └─────┬──────┘  └─────┬─────┘  └──────┬───────┘      │
│         │               │                │               │
│   ┌─────▼──────┐  ┌─────▼─────┐  ┌──────▼───────┐      │
│   │   Auth     │  │   QR Code │  │  File Model  │      │
│   │ Controller │  │ Controller│  │              │      │
│   └────────────┘  └───────────┘  └──────────────┘      │
└──────────┬──────────────┬────────────────────────────────┘
           │              │
           ▼              ▼
    ┌──────────┐   ┌──────────────┐
    │ MongoDB  │   │  Cloudinary  │
    │ Database │   │ (File Cloud) │
    └──────────┘   └──────────────┘
```

## 🛠 Key Technologies Used

| Technology | Kya kaam karta hai | Kyun use kiya |
|---|---|---|
| **React.js** | Frontend UI banana | Fast, component-based UI |
| **Vite** | Build tool / Dev server | CRA se bohot fast hai |
| **Tailwind CSS** | CSS styling | Quickly design karna without writing custom CSS |
| **Node.js** | Backend runtime | JavaScript server-side chalana |
| **Express.js** | Backend framework | Routes aur API banana easy ho jaata hai |
| **MongoDB** | NoSQL Database | Flexible, JSON-like data store |
| **Mongoose** | MongoDB ODM | Schema define karna easy hota hai |
| **Cloudinary** | Cloud file storage | Files ko cloud mein store karna (server pe nahi) |
| **JWT** | Authentication tokens | User ko login ke baad identify karna |
| **bcrypt** | Password hashing | Passwords ko secure karna |
| **Multer** | File upload middleware | Multipart form data handle karna |
| **QRCode** | QR Code generation | File URL ko QR code mein convert karna |
| **GSAP** | Animation library | Smooth, professional animations |
| **Axios** | HTTP client | Backend se API calls karna |

---

# 2. Folder Structure

```
kawach/                          ← 🏠 Root folder (poora project)
│
├── README.md                    ← Project ki description (GitHub ke liye)
├── LICENSE                      ← MIT License file
│
├── client/                      ← 🎨 FRONTEND (React App)
│   ├── index.html               ← Main HTML file (entry point)
│   ├── package.json             ← Frontend ki dependencies list
│   ├── vite.config.js           ← Vite configuration
│   ├── tailwind.config.js       ← Tailwind CSS configuration
│   ├── postcss.config.js        ← PostCSS plugins (Tailwind ke liye)
│   ├── eslint.config.js         ← Code quality rules
│   ├── public/                  ← Static assets (favicon, etc.)
│   └── src/                     ← 📦 MAIN SOURCE CODE
│       ├── main.jsx             ← 🚀 React App start hota hai yahan se
│       ├── App.jsx              ← 🗺 Routing define hoti hai yahan
│       ├── App.css              ← Default CSS (Vite ka, zyada use nahi)
│       ├── index.css            ← Tailwind CSS import
│       ├── assets/              ← 🖼 Images (logo.svg, react.svg)
│       ├── context/             ← 🧠 Global State Management
│       │   └── AuthContext.jsx  ← Login state manage karta hai
│       ├── components/          ← 🧩 Reusable Components
│       │   ├── ProtectedRoute.jsx ← Login check karta hai
│       │   └── Animate.jsx      ← Background animation
│       └── pages/               ← 📄 Pages (screens)
│           ├── Home.jsx         ← Landing page
│           ├── Login.jsx        ← Login form
│           ├── SignUp.jsx       ← Registration form
│           ├── Dashboard.jsx    ← File upload area
│           ├── GenerateQR.jsx   ← QR code display
│           └── Print.jsx        ← Document print page
│
└── server/                      ← ⚙️ BACKEND (Node.js + Express)
    ├── server.js                ← 🚀 Server start hota hai yahan se
    ├── package.json             ← Backend ki dependencies list
    ├── config/                  ← ⚙️ Configuration files
    │   └── db.js                ← MongoDB connection
    ├── models/                  ← 📊 Database Schemas (data ki shape)
    │   ├── userModel.js         ← User ka schema
    │   ├── fileModel.js         ← File ka schema
    │   └── qrModel.js          ← QR Code ka schema
    ├── routes/                  ← 🛤 API Routes
    │   ├── authRoutes.js        ← Login/Register routes
    │   ├── fileRoutes.js        ← File upload/delete/QR routes
    │   └── printRoutes.js       ← Print ke liye route
    ├── controllers/             ← 🎮 Business Logic
    │   ├── authController.js    ← Login/Register logic
    │   └── qrcodeController.js  ← QR Code generate karne ka logic
    ├── middlewares/             ← 🛡 Request processing filters
    │   ├── authMiddleware.js    ← JWT token verify karta hai
    │   └── multer.js            ← File upload handle karta hai
    ├── helper/                  ← 🔧 Utility functions
    │   └── authHelper.js        ← Password hash/compare
    └── utils/                   ← 🔨 External service integrations
        └── cloudinary.js        ← Cloudinary upload/delete
```

### Folder Interactions — Kaise ek doosre se connected hain:

```
┌────────────┐     uses      ┌───────────────┐
│  routes/   │ ──────────▶   │ controllers/  │
└─────┬──────┘               └───────┬───────┘
      │                              │
      │ uses                         │ uses
      ▼                              ▼
┌────────────┐               ┌───────────────┐
│middlewares/│               │   models/     │
└────────────┘               └───────┬───────┘
                                     │
                                     │ talks to
                                     ▼
                              ┌──────────────┐
                              │   MongoDB    │
                              └──────────────┘
```

- **routes/** → Ye decide karta hai ki konsa URL konsi function call karega
- **controllers/** → Actual kaam yahan hota hai (business logic)
- **middlewares/** → Beech mein filter lagata hai (token check, file upload)
- **models/** → Database mein data kaise store hoga ye define karta hai
- **config/** → Database connection setup
- **helper/** → Password related utility functions
- **utils/** → Cloudinary (cloud storage) se baat karne ka code

---

# 3. File-by-File Explanation

---

## 🔵 SERVER-SIDE FILES

---

### 📄 `server/server.js` — Server ka Entry Point

**Purpose:** Ye poore backend ka starting point hai. Express server yahan create hota hai, middlewares lagaye jaate hain, routes connect hote hain, aur server start hota hai.

**Agar remove karo:** ❌ Poora backend band ho jaayega. Koi API kaam nahi karegi.

**Dependencies:** `config/db.js`, `routes/authRoutes.js`, `routes/fileRoutes.js`, `routes/printRoutes.js`

**Code Walkthrough:**

```javascript
import express from 'express'         // Express framework import
import colors from 'colors'           // Console mein colourful text ke liye
import dotenv from 'dotenv'           // .env file se variables read karne ke liye
import morgan from 'morgan'           // HTTP requests ko log karne ke liye
import cors from 'cors'               // Cross-Origin requests allow karne ke liye
import connectDb from './config/db.js' // Database connection function
import authRoutes from './routes/authRoutes.js'   // Auth ke routes
import fileRoutes from './routes/fileRoutes.js'   // File ke routes
import printRoutes from './routes/printRoutes.js' // Print ke routes
```

**Middleware Setup kya hai:**
1. `cors()` → Frontend (port 5173) se backend (port 8080) ko call karne deta hai
2. `express.json()` → JSON data parse karta hai (req.body mein)
3. `express.urlencoded()` → Form data parse karta hai
4. `morgan('dev')` → Har request ka log console mein print karta hai

**Routes Mount karna:**
```javascript
app.use("/api/v1/auth", authRoutes);    // /api/v1/auth/login, /register
app.use("/api/v1/file", fileRoutes);    // /api/v1/file/upload, /delete
app.use('/api/v1/print', printRoutes);  // /api/v1/print/:fileId
```
Jab bhi koi `/api/v1/auth/login` hit karega, toh `authRoutes` file ke andar wala matching route chalega.

---

### 📄 `server/config/db.js` — Database Connection

**Purpose:** MongoDB se connection establish karta hai using Mongoose.

**Agar remove karo:** ❌ Database se koi baat nahi ho paayegi. Na user save hoga, na file, na QR.

**Code:**
```javascript
const connectDb = async () => {
  try {
      const conn = await mongoose.connect(process.env.MONGO_URL);
      // process.env.MONGO_URL → .env file se MongoDB ka URL aata hai
      // Example: mongodb+srv://username:password@cluster.mongodb.net/kawach
      console.log(`Connected to database ${conn.connection.host}`);
  } catch (err) {
      console.log(`Error in mongoDb ${err}`);
  }
};
```

**Simple Explanation:** Ye function `.env` file se MongoDB ka URL leke uspar connect karta hai. Agar connection fail ho jaaye toh error print karta hai, crash nahi karta.

---

### 📄 `server/models/userModel.js` — User Schema

**Purpose:** Ye define karta hai ki ek "User" document database mein kaisa dikhega.

**Agar remove karo:** ❌ Login/Register kaam nahi karega kyunki user data ka structure pata nahi hoga.

**Schema Fields:**

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | String | ✅ | User ka naam |
| `email` | String | ✅ (unique) | Email ID (duplicate allowed nahi) |
| `password` | String | ✅ | Hashed password (original password nahi) |
| `phone` | String | ✅ | Phone number |
| `timestamps` | Auto | Auto | `createdAt` aur `updatedAt` automatically add hote hain |

**MongoDB mein actual document aise dikhega:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Prince",
  "email": "prince@gmail.com",
  "password": "$2b$10$K4Jz...(hashed)",
  "phone": "9876543210",
  "createdAt": "2026-06-07T12:00:00Z",
  "updatedAt": "2026-06-07T12:00:00Z"
}
```

---

### 📄 `server/models/fileModel.js` — File Schema

**Purpose:** Upload ki hui file ka record database mein rakhta hai.

**Agar remove karo:** ❌ File upload/delete/print kuch bhi kaam nahi karega.

**Schema Fields:**

| Field | Type | Description |
|---|---|---|
| `filename` | String | Original file ka naam (e.g., "aadhaar.pdf") |
| `path` | String | Cloudinary URL jahan file stored hai |
| `content` | Buffer | File ka raw data (optional, zyada use nahi hota) |
| `mimetype` | String | File ka type (e.g., "image/png", "application/pdf") |
| `size` | Number | File ka size in bytes |
| `uploadDate` | Date | Kab upload hua |
| `user` | ObjectId → User | Kis user ne upload kiya (reference to User model) |
| `PublicId` | String | Cloudinary ka unique ID (delete karte waqt chahiye) |

**Important:** `user` field mein `ref: 'User'` likha hai — iska matlab ye field `User` collection ka `_id` store karta hai. Isse hum pata kar sakte hain ki ye file kisne upload ki.

---

### 📄 `server/models/qrModel.js` — QR Code Schema

**Purpose:** Generate hue QR codes ka record rakhta hai.

**Agar remove karo:** ❌ QR code show nahi hoga frontend pe.

**Schema Fields:**

| Field | Type | Description |
|---|---|---|
| `fileId` | ObjectId → File | Konsi file ka QR code hai (reference) |
| `qrCode` | String | QR code image ka Cloudinary URL |
| `fileUrl` | String | Original file ka URL (QR mein encoded hota hai) |
| `createdAt` | Date | Kab create hua |

**Relationship samjho:**
```
User ──uploads──▶ File ──generates──▶ QRCode
  │                  │                    │
  │                  │                    │
  ▼                  ▼                    ▼
users           files collection     qrcodes collection
collection      (has user._id)       (has file._id)
```

---

### 📄 `server/helper/authHelper.js` — Password Hash/Compare

**Purpose:** Password ko hash karna (encrypt jaise) aur login ke waqt compare karna.

**Agar remove karo:** ❌ Register mein password plain text mein save hoga (SECURITY RISK!) aur login mein password match nahi kar paayega.

**Code:**
```javascript
export const hashPassword = async (password) => {
    const saltRounds = 10;  // Complexity level (jitna zyada, utna slow but secure)
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
    // "prince123" → "$2b$10$K4JzH3..." (unreadable form mein convert)
};

export const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
    // "prince123" vs "$2b$10$K4JzH3..." → true ya false
};
```

**Kyun zaruri hai:** Agar database hack ho jaaye toh bhi passwords readable nahi honge kyunki wo hashed form mein stored hain.

---

### 📄 `server/middlewares/authMiddleware.js` — JWT Token Check

**Purpose:** Har protected API call se pehle check karta hai ki user logged in hai ya nahi.

**Agar remove karo:** ❌ Koi bhi bina login ke files upload/delete kar paayega — BOHOT BADA SECURITY RISK!

**Code Explanation:**
```javascript
export const isAuthenticated = async (req, res, next) => {
    // Step 1: Authorization header se token nikalo
    // Header: "Bearer eyJhbGciOiJI..."
    // Split karke [1] index pe actual token milta hai
    const token = req.headers.authorization?.split(' ')[1];
    
    // Step 2: Token nahi hai toh reject
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }
    
    // Step 3: Token verify karo JWT_SECRET se
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    // decode = { _id: "507f1f77bcf86cd799439011", iat: ..., exp: ... }
    
    // Step 4: User info ko request mein attach karo
    req.user = decode;  // Ab aage koi bhi route req.user._id use kar sakta hai
    
    // Step 5: Aage jaane do (next middleware/route handler ko)
    next();
};
```

**Visualize karo:**
```
Client Request ──▶ isAuthenticated() ──▶ Route Handler
                      │
                      ├── Token nahi? → 401 Access Denied
                      ├── Token galat? → 400 Invalid Token
                      └── Token sahi? → req.user set ──▶ next()
```

---

### 📄 `server/middlewares/multer.js` — File Upload Handler

**Purpose:** File upload ko handle karta hai aur directly Cloudinary par save karta hai.

**Agar remove karo:** ❌ File upload bilkul kaam nahi karega.

**Code Explanation:**
```javascript
// Cloudinary storage setup — files seedha Cloudinary mein upload hongi
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,  // Cloudinary instance
    params: {
        folder: "uploads",   // Cloudinary mein "uploads" folder mein save hoga
        allowed_formats: ["jpg", "jpeg", "png", "pdf", "doc", "docx"],  // Sirf ye formats allowed
        public_id: (req, file) => {
            // Unique naam generate karta hai: "abc123def456_aadhaar.pdf"
            return `${crypto.randomBytes(12).toString('hex')}_${file.originalname}`;
        }
    }
});

// Multer middleware create karo
const upload = multer({
    storage: storage,     // Cloudinary storage use karo
    limits: {
        fileSize: 10 * 1024 * 1024  // Max 10MB file size
    }
});
```

**Flow:**
```
User selects file → Multer catches it → CloudinaryStorage uploads to Cloudinary
→ Cloudinary returns URL → URL available in req.file.path
```

---

### 📄 `server/utils/cloudinary.js` — Cloudinary Integration

**Purpose:** Cloudinary cloud service se baat karta hai — QR code upload karna aur files delete karna.

**Agar remove karo:** ❌ QR code Cloudinary par save nahi hoga aur files delete nahi ho paayengi.

**3 Important Functions:**

1. **`cloudinary.config()`** — Cloudinary credentials set karta hai (API key, secret)

2. **`uploadQRCodeBuffer(buffer)`** — QR code image (buffer) ko Cloudinary par upload karta hai:
```javascript
// Buffer → Base64 → Data URI → Upload to Cloudinary
const base64String = buffer.toString('base64');
const dataURI = `data:image/png;base64,${base64String}`;
const response = await cloudinary.uploader.upload(dataURI, {
    folder: "qrcodes",
    public_id: publicId
});
```

3. **`deleteFileFromCloudinary(publicId)`** — File ko Cloudinary se delete karta hai:
```javascript
// Pehle image ke roop mein try karo
// Agar fail ho toh "raw" file ke roop mein try karo
// Dono fail → error throw karo
```

---

### 📄 `server/controllers/authController.js` — Auth Business Logic

**Purpose:** Register aur Login ka actual logic yahan hai.

**Agar remove karo:** ❌ Na user register ho paayega, na login.

#### `registerController` — New User Banana:
```
Step 1: req.body se name, email, password, phone lo
Step 2: Validation — koi field empty toh nahi?
Step 3: Check — kya ye email pehle se registered hai?
   ├── Haan → "Already registered, please login"
   └── Nahi → Continue
Step 4: Password ko hash karo (bcrypt)
Step 5: Naya user MongoDB mein save karo
Step 6: Success response bhejo
```

#### `loginController` — User Login:
```
Step 1: req.body se email, password lo
Step 2: Validation — dono filled hain?
Step 3: Database mein email se user dhundho
   ├── Nahi mila → "Email is not registered"
   └── Mila → Continue
Step 4: Password compare karo (bcrypt)
   ├── Match nahi → "Invalid Password"
   └── Match → Continue
Step 5: JWT token create karo (expires in 2 hours)
        → Token mein user ka _id encode hota hai
Step 6: Response bhejo: { user data, token }
```

---

### 📄 `server/controllers/qrcodeController.js` — QR Code Generator

**Purpose:** File ka URL leke uska QR code generate karta hai aur Cloudinary par save karta hai.

**Agar remove karo:** ❌ QR code generate nahi hoga.

**Code Flow:**
```
File URL milta hai (e.g., "http://localhost:5173/print/abc123")
     ↓
QRCode.toBuffer(fileUrl) → QR code image buffer ban jata hai
     ↓
uploadQRCodeBuffer(buffer) → Cloudinary par upload hota hai
     ↓
New QRModel document save hota hai MongoDB mein
     ↓
Cloudinary URL return hota hai (ye frontend ko milega)
```

**Important:** QR code mein original file ka URL nahi hai — **print page ka URL** hai (`/print/:fileId`). Jab koi QR scan karega toh print page khulega, direct file nahi milegi.

---

### 📄 `server/routes/authRoutes.js` — Authentication Routes

**Purpose:** Login, Register, aur Test ke endpoints define karta hai.

| Method | URL | Middleware | Controller | Kya karta hai |
|---|---|---|---|---|
| POST | `/api/v1/auth/register` | None | `registerController` | Naya user banana |
| POST | `/api/v1/auth/login` | None | `loginController` | User login |
| GET | `/api/v1/auth/test` | `isAuthenticated` | `testController` | Protected route test |

---

### 📄 `server/routes/fileRoutes.js` — File Operation Routes (MOST IMPORTANT!)

**Purpose:** File upload, QR fetch, aur file delete — sab yahan hai. Ye sabse zyada code wali file hai backend mein.

| Method | URL | Middleware | Kya karta hai |
|---|---|---|---|
| POST | `/api/v1/file/upload` | `isAuthenticated` → `upload.single('file')` | File upload + QR generate |
| GET | `/api/v1/file/qrcode/:fileId` | `isAuthenticated` | QR code fetch karo |
| DELETE | `/api/v1/file/delete/:fileId` | `isAuthenticated` | File + QR delete karo |

#### Upload Route ki detail:
```
1. isAuthenticated → Token check
2. upload.single('file') → Multer file ko Cloudinary par upload karta hai
3. Route Handler:
   a. req.file se file info lo (Cloudinary URL, public ID, etc.)
   b. FileModel mein save karo
   c. generateQRCode() call karo → QR generate + save
   d. Response bhejo: { fileId, fileUrl }
```

#### Delete Route ki detail:
```
1. File dhundho (aur check karo ki ye user ki hi file hai)
2. Cloudinary se file delete karo (PublicId use karke)
3. QRModel se QR record delete karo
4. FileModel se file record delete karo
5. Success response bhejo
```

---

### 📄 `server/routes/printRoutes.js` — Print Route

**Purpose:** QR code scan karne ke baad file ki details deta hai frontend ko.

**Route:** `GET /api/v1/print/:fileId`

**Flow:**
```
1. fileId URL se nikalo
2. MongoDB mein FileModel.findById(fileId) se file dhundho
3. File nahi mili → 404 error
4. File mili → file ka URL, name, mimetype bhejo
5. Frontend is data se print page render karega
```

---

## 🔴 CLIENT-SIDE FILES

---

### 📄 `client/index.html` — HTML Entry Point

**Purpose:** Browser mein sabse pehle ye file load hoti hai. Iske andar React app mount hota hai.

**Important Line:**
```html
<div id="root"></div>                              <!-- React app yahan render hoga -->
<script type="module" src="/src/main.jsx"></script> <!-- React app ka entry point -->
```

---

### 📄 `client/src/main.jsx` — React App ka Starting Point

**Purpose:** React app ko initialize karta hai, AuthProvider se wrap karta hai, aur axios configure karta hai.

**Code:**
```javascript
// Axios ka base URL set karo — ab har request ke aage ye automatically lagega
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_API;
// e.g., axios.post('/api/v1/auth/login') → "http://localhost:8080/api/v1/auth/login"

createRoot(document.getElementById('root')).render(
    <AuthProvider>     {/* Poore app ko AuthContext se wrap karo */}
        <App />        {/* Main App component */}
    </AuthProvider>
)
```

**Agar remove karo:** ❌ Poora frontend blank rahega.

---

### 📄 `client/src/App.jsx` — Routing Configuration

**Purpose:** Ye decide karta hai ki konsa URL konsa page dikhayega.

**Routes Table:**

| URL Path | Component | Protected? | Description |
|---|---|---|---|
| `/` | `<Home />` | ❌ | Landing page |
| `/login` | `<Login />` | ❌ | Login form |
| `/signup` | `<Signup />` | ❌ | Register form |
| `/dashboard` | `<Dashboard />` | ✅ | File upload area |
| `/generate-qr` | `<GenerateQR />` | ✅ | QR code display |
| `/print/:fileId` | `<Print />` | ❌ | Print page (QR se khulta hai) |
| `*` (anything else) | `<Home />` | ❌ | 404 par Home page dikhao |

**Protected Route matlab:** `ProtectedRoute` component pehle check karega ki user login hai ya nahi. Agar nahi → login page par redirect.

---

### 📄 `client/src/context/AuthContext.jsx` — Global State Management

**Purpose:** Poore app mein user ka login state manage karta hai. Ye React ka Context API use karta hai.

**Ye 5 cheezein provide karta hai:**

| Name | Type | Kya karta hai |
|---|---|---|
| `user` | State | Current logged-in user ka data (ya null) |
| `fileId` | State | Currently upload ki hui file ka ID |
| `login(userData, token)` | Function | User ko login karta hai + token localStorage mein save |
| `logout()` | Function | User ko logout karta hai + token remove |
| `setFile(id)` | Function | File ID set karta hai (upload ke baad) |

**Visualize karo:**
```
                AuthContext.Provider
                        │
           provides: { user, fileId, login, logout, setFile }
                        │
         ┌──────────────┼──────────────┐
         │              │              │
      <Home>      <Dashboard>    <GenerateQR>
    (reads user)  (calls login,  (reads fileId,
                   setFile)       calls logout)
```

**Token Flow:**
```
Login → Server sends token → login() → localStorage.setItem('token', token)
                                                    │
Any API call → localStorage.getItem('token') ←──────┘
                    │
    Header: "Authorization: Bearer <token>"
```

---

### 📄 `client/src/components/ProtectedRoute.jsx` — Route Guard

**Purpose:** Protected routes ko guard karta hai — sirf logged-in users hi access kar sakein.

**Code:**
```javascript
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();                      // AuthContext se user lo
  return user ? children : <Navigate to="/login" />; // User hai → page dikhao, nahi → login pe bhejo
};
```

**Use:** Dashboard aur GenerateQR pages ke around wrapped hai:
```jsx
<Route path="/dashboard" element={
    <ProtectedRoute>     {/* <-- Guard */}
        <Dashboard />
    </ProtectedRoute>
} />
```

---

### 📄 `client/src/components/Animate.jsx` — Background Animation

**Purpose:** Background mein beautiful gradient circles dikhata hai jo pulse karte hain.

**Agar remove karo:** ⚠️ App kaam karega lekin pages plain dikhenge without animation.

**Code:** Do bade gradient circles (blue-purple aur cyan-blue) jo blur hoke animate karte hain.

---

### 📄 `client/src/pages/Home.jsx` — Landing Page

**Purpose:** Pehla page jo user ko dikhai deta hai. App ki features, stats dikhata hai aur Login/Signup buttons deta hai.

**Key Logic:**
- GSAP animations se elements smoothly appear hote hain
- Agar user already logged in hai → Login/Signup buttons chup jaate hain
- 3 feature cards: Secure Password, End-to-End Encryption, Privacy First
- 3 stats: 99.99% Uptime, 1M+ Protected Files, 24/7 Monitoring

---

### 📄 `client/src/pages/Login.jsx` — Login Page

**Purpose:** Email aur password leke backend pe login request bhejta hai.

**Complete Flow:**
```
1. User email/password type karta hai
2. handleChange() → formData state update hoti hai
3. Form submit → handleSubmit() chalta hai
4. axios.post('/api/v1/auth/login', { email, password })
   → Backend pe jaata hai
5. Response aata hai:
   ├── Success → login(user, token) call → Navigate to /dashboard
   └── Fail → toast.error("message")
```

**Token kahan store hota hai:**
```
Server Response → { user: {...}, token: "eyJ..." }
                                      │
login(user, token) ← AuthContext      │
    │                                  │
    └── localStorage.setItem('token', token)
```

---

### 📄 `client/src/pages/SignUp.jsx` — Registration Page

**Purpose:** Naye user ka registration form.

**Flow Login se almost same hai** — sirf fields zyada hain (name, phone bhi add hain) aur `/api/v1/auth/register` pe POST hota hai.

**Ek NOTE:** SignUp ke baad directly `/dashboard` pe navigate hota hai but `login()` call nahi hota — matlab user ko manually login karna padega (ye ek **bug** hai).

---

### 📄 `client/src/pages/Dashboard.jsx` — File Upload Page (Core Feature!)

**Purpose:** Ye main page hai jahan user apni file upload karta hai.

**Features:**
1. **Drag & Drop** — File ko drag karke drop karo
2. **Click to Select** — Ya button click karke file select karo
3. **Auto Upload** — File select karte hi upload start ho jaata hai
4. **Security Message** — User ko privacy assurance dikhata hai

**Upload Flow Detail:**
```
User selects/drops file
     ↓
handleFileSelect() / handleDrop()
     ↓
setSelectedFile(file) → UI mein file name show hota hai
     ↓
handleUpload(file)
     ↓
FormData banana → formData.append('file', file)
     ↓
axios.post('/api/v1/file/upload', formData, {
    headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`  ← localStorage se token
    }
})
     ↓
Server Response:
  ├── Success → setFile(fileId) → navigate('/generate-qr')
  └── Error → toast.error()
```

---

### 📄 `client/src/pages/GenerateQR.jsx` — QR Code Display Page (CORE!)

**Purpose:** Upload ke baad QR code fetch karke display karta hai, aur 20 second ka timer chalata hai.

**Ye file sabse complex hai client mein. States:**

| State | Purpose |
|---|---|
| `loading` | API call chal rahi hai ya nahi |
| `error` | Error message (agar koi error aayi) |
| `qrGenerated` | QR code generate ho gaya ya nahi |
| `qrCode` | QR code image ka URL |
| `documentInfo` | File ka naam, date, status |
| `timeLeft` | Timer countdown (20 seconds) |
| `timerActive` | Timer chal raha hai ya nahi |

**Complete Flow:**
```
Page load hota hai → "Generate QR Code" button dikhai deta hai
     ↓
User clicks button → generateQRCode()
     ↓
axios.get('/api/v1/file/qrcode/${fileId}')
     ↓
Response: { qrCode: "cloudinary-url", fileName, uploadDate }
     ↓
setQrCode(url) → QR image display hoti hai
setTimerActive(true) → Timer start (20 seconds)
     ↓
Har 1 second: timeLeft - 1
     ↓
timeLeft === 0 → handleQRExpiration()
     ↓
axios.delete('/api/v1/file/delete/${fileId}')
→ File + QR Cloudinary + DB se delete
→ Navigate to /dashboard
→ Toast: "QR expired, file deleted"
```

**Timer Logic (useEffect):**
```javascript
useEffect(() => {
    let timer;
    if (timerActive && timeLeft > 0) {
        timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    handleQRExpiration(); // TIME UP! File delete!
                    return 0;
                }
                return prevTime - 1; // 1 second minus
            });
        }, 1000); // Har 1 second
    }
    return () => clearInterval(timer); // Cleanup on unmount
}, [timerActive, timeLeft]);
```

---

### 📄 `client/src/pages/Print.jsx` — Document Print Page

**Purpose:** QR code scan karne ke baad ye page khulta hai. Yahan se document print hota hai.

**Security Features (IMPORTANT!):**
```javascript
// Right-click disable
document.addEventListener('contextmenu', e => e.preventDefault());

// Keyboard shortcuts disable
// Ctrl+S, Ctrl+P, Ctrl+C, Ctrl+V, F12, Ctrl+Shift+I — sab band!
document.addEventListener('keydown', handleKeyDown);

// Text select disable
document.addEventListener('selectstart', e => e.preventDefault());

// Drag disable
document.addEventListener('dragstart', e => e.preventDefault());
```

**Print Flow:**
```
QR scan → /print/:fileId URL open hota hai
     ↓
useEffect → axios.get('/api/v1/print/${fileId}')
     ↓
File data milta hai: { url, filename, mimetype }
     ↓
User "Print" button click karta hai → handlePrint()
     ↓
window.open('', '_blank') → Naya window khulta hai
     ↓
Image load → window.print() → Print dialog
     ↓
Print ke baad → window.close() → Redirect to /dashboard
```

---

### 📄 `client/vite.config.js` — Vite Configuration

**Purpose:** Vite build tool ka config. React plugin enable karta hai.

**Agar remove karo:** ❌ Frontend build nahi hoga.

---

### 📄 `client/tailwind.config.js` — Tailwind CSS Configuration

**Purpose:** Tailwind CSS ko bata hai ki kahan-kahan CSS classes scan karni hain.

**`content`** field mein `./src/**/*.{js,ts,jsx,tsx}` likha hai — matlab Tailwind src folder ke sab files mein se used classes extract karega.

---

### 📄 `client/src/index.css` — Tailwind Import

```css
@tailwind base;        /* Reset/normalize CSS */
@tailwind components;  /* Component styles */
@tailwind utilities;   /* Utility classes (bg-red-500, text-xl, etc.) */
```

Ye 3 lines Tailwind ko activate karti hain.

---

# 4. Execution Flow (Most Important)

## 🚀 Application Start Hone Ka Flow

### Backend Start:
```
npm start (server folder mein)
     ↓
node server.js
     ↓
dotenv.config() → .env file ke variables load
     ↓
connectDb() → MongoDB se connection
     ↓
Middlewares apply: cors, json parser, morgan
     ↓
Routes mount: /api/v1/auth, /api/v1/file, /api/v1/print
     ↓
app.listen(8080) → "Server Running on port 8080"
     ↓
✅ Backend ready!
```

### Frontend Start:
```
npm run dev (client folder mein)
     ↓
Vite dev server start → port 5173
     ↓
index.html load hota hai
     ↓
main.jsx execute hota hai
     ↓
axios.defaults.baseURL = "http://localhost:8080"
     ↓
<AuthProvider> → Global state ready
     ↓
<App /> → Router ready
     ↓
URL "/" → <Home /> render
     ↓
✅ Frontend ready!
```

## 🔐 Complete User Journey — Start to Finish

```
╔══════════════════════════════════════════════════════════╗
║                    KAWACH USER JOURNEY                    ║
╚══════════════════════════════════════════════════════════╝

1️⃣  User opens http://localhost:5173
        │
        ▼
    HOME PAGE loads
    ├── GSAP animations play
    ├── Features & stats display
    └── "Secure Login" / "Join Securely" buttons
        │
        ▼
2️⃣  User clicks "Join Securely"
        │
        ▼
    SIGNUP PAGE loads
    ├── User fills: Name, Email, Password, Phone
    └── Clicks "Create Secure Account"
        │
        ▼
    axios.post('/api/v1/auth/register') ──────────────────▶ SERVER
        │                                                       │
        │                                           registerController()
        │                                           ├── Validate fields
        │                                           ├── Check: email exists?
        │                                           ├── Hash password (bcrypt)
        │                                           ├── Save to MongoDB
        │                                           └── Send: { success: true }
        │                                                       │
        ◀───────────────────────────────────────────────────────┘
        │
        ▼
3️⃣  User redirected to LOGIN PAGE
    ├── User fills: Email, Password
    └── Clicks "Secure Sign In"
        │
        ▼
    axios.post('/api/v1/auth/login') ─────────────────────▶ SERVER
        │                                                       │
        │                                           loginController()
        │                                           ├── Find user by email
        │                                           ├── Compare password (bcrypt)
        │                                           ├── Generate JWT token
        │                                           └── Send: { user, token }
        │                                                       │
        ◀───────────────────────────────────────────────────────┘
        │
        ▼
    login(user, token) ← AuthContext
    ├── setUser(userData) → app knows user is logged in
    └── localStorage.setItem('token', token)
        │
        ▼
4️⃣  DASHBOARD loads (ProtectedRoute allows)
    ├── User's email shown in navbar
    ├── Security message displayed
    └── Upload area ready (drag & drop)
        │
        ▼
5️⃣  User drags a file OR clicks "Select File"
        │
        ▼
    handleUpload(file)
    ├── FormData create → file attach
    └── axios.post('/api/v1/file/upload') ────────────────▶ SERVER
        │                                                       │
        │                                     isAuthenticated()
        │                                     ├── Token verify ✅
        │                                     └── req.user = { _id }
        │                                              │
        │                                     upload.single('file')
        │                                     ├── Multer catches file
        │                                     ├── CloudinaryStorage uploads
        │                                     └── req.file = { path, filename }
        │                                              │
        │                                     Route Handler:
        │                                     ├── FileModel.save() → MongoDB
        │                                     ├── generateQRCode()
        │                                     │   ├── QRCode.toBuffer(printURL)
        │                                     │   ├── Upload QR to Cloudinary
        │                                     │   └── QRModel.save() → MongoDB
        │                                     └── Send: { fileId, fileUrl }
        │                                                       │
        ◀───────────────────────────────────────────────────────┘
        │
        ▼
    setFile(fileId) ← AuthContext
    navigate('/generate-qr')
        │
        ▼
6️⃣  GENERATE QR PAGE loads
    └── User clicks "Generate QR Code"
        │
        ▼
    axios.get('/api/v1/file/qrcode/${fileId}') ──────────▶ SERVER
        │                                                       │
        │                                     isAuthenticated() ✅
        │                                     ├── File verify (user owns it?)
        │                                     ├── QRModel.findOne({ fileId })
        │                                     └── Send: { qrCode URL, fileName }
        │                                                       │
        ◀───────────────────────────────────────────────────────┘
        │
        ▼
    QR Code image displayed + Timer starts (20 seconds)
        │
        ▼
7️⃣  SHOP OWNER scans QR code
    QR contains: "http://localhost:5173/print/abc123"
        │
        ▼
    PRINT PAGE loads → /print/abc123
    axios.get('/api/v1/print/abc123') ───────────────────▶ SERVER
        │                                                       │
        │                                     FileModel.findById()
        │                                     └── Send: { url, filename }
        │                                                       │
        ◀───────────────────────────────────────────────────────┘
        │
        ▼
    Document details shown
    User clicks "Print"
    → window.open() → print dialog → print → window close
        │
        ▼
8️⃣  Meanwhile: TIMER EXPIRES (20 seconds up!)
        │
        ▼
    handleQRExpiration()
    axios.delete('/api/v1/file/delete/${fileId}') ──────▶ SERVER
        │                                                       │
        │                                     ├── Cloudinary se file delete
        │                                     ├── QRModel.delete()
        │                                     └── FileModel.delete()
        │                                                       │
        ◀───────────────────────────────────────────────────────┘
        │
        ▼
    🗑️ File PERMANENTLY DELETED — no trace left!
    User redirected to Dashboard
        │
        ▼
    ╔════════════════════════════════════════════╗
    ║   ✅ MISSION ACCOMPLISHED — SECURE PRINT   ║
    ╚════════════════════════════════════════════╝
```

---

# 5. Request Lifecycle

## Example: File Upload Request — Start to End

Let's trace the **exact** request when a user uploads `aadhaar.pdf`:

```
┌─────────── CLIENT SIDE ─────────────────────────────────────┐
│                                                              │
│  1. User drags "aadhaar.pdf" onto Dashboard                  │
│     ↓                                                        │
│  2. handleDrop(e) triggers                                   │
│     e.dataTransfer.files[0] → File object                    │
│     ↓                                                        │
│  3. handleUpload(file) called                                │
│     ↓                                                        │
│  4. FormData created:                                        │
│     const formData = new FormData();                         │
│     formData.append('file', file);                           │
│     ↓                                                        │
│  5. HTTP Request sent:                                       │
│     POST http://localhost:8080/api/v1/file/upload             │
│     Headers: {                                               │
│       'Content-Type': 'multipart/form-data',                 │
│       'Authorization': 'Bearer eyJhbGci...'                  │
│     }                                                        │
│     Body: [binary file data]                                 │
│                                                              │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌─────────── SERVER SIDE ─────────────────────────────────────┐
│                                                              │
│  6. Express receives POST /api/v1/file/upload                │
│     ↓                                                        │
│  7. MIDDLEWARE 1: isAuthenticated()                           │
│     → req.headers.authorization = "Bearer eyJhbGci..."       │
│     → token = "eyJhbGci..."                                  │
│     → jwt.verify(token, JWT_SECRET)                          │
│     → decode = { _id: "507f1f77bcf86cd799439011" }           │
│     → req.user = { _id: "507f1f77bcf86cd799439011" }         │
│     → next() ✅                                              │
│     ↓                                                        │
│  8. MIDDLEWARE 2: upload.single('file')                      │
│     → Multer receives file from FormData                     │
│     → CloudinaryStorage picks up file                        │
│     → Cloudinary API call: Upload "aadhaar.pdf"              │
│     → Cloudinary returns:                                    │
│       {                                                      │
│         url: "https://res.cloudinary.com/.../abc_aadhaar",   │
│         public_id: "uploads/abc_aadhaar",                    │
│         bytes: 245760                                        │
│       }                                                      │
│     → req.file = {                                           │
│         originalname: "aadhaar.pdf",                         │
│         path: "https://res.cloudinary.com/.../abc_aadhaar",  │
│         filename: "uploads/abc_aadhaar",                     │
│         mimetype: "application/pdf",                         │
│         size: 245760                                         │
│       }                                                      │
│     → next() ✅                                              │
│     ↓                                                        │
│  9. ROUTE HANDLER executes:                                  │
│     a. Create FileModel document:                            │
│        {                                                     │
│          filename: "aadhaar.pdf",                             │
│          path: "https://res.cloudinary.com/.../abc_aadhaar", │
│          mimetype: "application/pdf",                        │
│          size: 245760,                                       │
│          user: "507f1f77bcf86cd799439011",                   │
│          PublicId: "uploads/abc_aadhaar"                     │
│        }                                                     │
│     b. newFile.save() → MongoDB mein save                    │
│        → _id generated: "60d5ec9af682fbd12e8c4532"           │
│     ↓                                                        │
│  10. generateQRCode() called:                                │
│      fileId = "60d5ec9af682fbd12e8c4532"                     │
│      fileUrl = "http://localhost:5173/print/60d5ec9af..."     │
│      ↓                                                       │
│      a. QRCode.toBuffer(fileUrl) → PNG buffer (QR image)     │
│      b. buffer → base64 → data URI                           │
│      c. Cloudinary upload → qrCode URL returned              │
│      d. QRModel.save({                                       │
│           fileId: "60d5ec9af682fbd12e8c4532",                │
│           qrCode: "https://res.cloudinary.com/.../qr_123",  │
│           fileUrl: "http://localhost:5173/print/60d5ec..."    │
│         })                                                   │
│      ↓                                                       │
│  11. Response sent:                                          │
│      {                                                       │
│        success: true,                                        │
│        message: "File uploaded successfully",                │
│        fileId: "60d5ec9af682fbd12e8c4532",                   │
│        fileUrl: "https://res.cloudinary.com/.../abc_aadhaar" │
│      }                                                       │
│                                                              │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌─────────── CLIENT SIDE ─────────────────────────────────────┐
│                                                              │
│  12. axios.post() resolves with response                     │
│      ↓                                                       │
│  13. setFile("60d5ec9af682fbd12e8c4532") → Context mein save │
│      ↓                                                       │
│  14. toast.success("File uploaded successfully")             │
│      ↓                                                       │
│  15. navigate('/generate-qr') → QR page load                │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

# 6. Architecture Deep Dive

## 🎨 Frontend Architecture

```
┌──────────────────────────────────────────────────┐
│              FRONTEND (React + Vite)              │
│                                                   │
│  ┌─────────────────────────────────────────────┐  │
│  │           CONTEXT LAYER (Global State)       │  │
│  │                                              │  │
│  │  AuthContext → { user, token, fileId }       │  │
│  │  ├── login() → set user + save token         │  │
│  │  ├── logout() → clear user + remove token    │  │
│  │  └── setFile() → store uploaded file ID      │  │
│  └──────────────────────────────────────────────┘  │
│                        │                           │
│  ┌─────────────────────┴───────────────────────┐  │
│  │           ROUTING LAYER (React Router)       │  │
│  │                                              │  │
│  │  "/" ──────────▶ Home                         │  │
│  │  "/login" ─────▶ Login                        │  │
│  │  "/signup" ────▶ SignUp                        │  │
│  │  "/dashboard" ─▶ ProtectedRoute → Dashboard   │  │
│  │  "/generate-qr" ▶ ProtectedRoute → GenerateQR │  │
│  │  "/print/:id" ─▶ Print                        │  │
│  └──────────────────────────────────────────────┘  │
│                        │                           │
│  ┌─────────────────────┴───────────────────────┐  │
│  │           COMPONENT LAYER                    │  │
│  │                                              │  │
│  │  Pages: Home, Login, SignUp, Dashboard,      │  │
│  │         GenerateQR, Print                    │  │
│  │                                              │  │
│  │  Shared: ProtectedRoute, Animate             │  │
│  └──────────────────────────────────────────────┘  │
│                        │                           │
│  ┌─────────────────────┴───────────────────────┐  │
│  │           API LAYER (Axios)                  │  │
│  │                                              │  │
│  │  Base URL: http://localhost:8080              │  │
│  │  Auth: Bearer token from localStorage        │  │
│  │  Calls: POST /auth/login, POST /file/upload  │  │
│  │          GET /file/qrcode/:id, etc.           │  │
│  └──────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

## ⚙️ Backend Architecture

```
┌──────────────────────────────────────────────────┐
│            BACKEND (Node.js + Express)            │
│                                                   │
│  ┌─────────────────────────────────────────────┐  │
│  │        MIDDLEWARE PIPELINE                   │  │
│  │                                              │  │
│  │  Request → cors → json parser → morgan       │  │
│  │    → isAuthenticated (JWT) → multer (file)   │  │
│  │    → Route Handler                           │  │
│  └──────────────────────────────────────────────┘  │
│                        │                           │
│  ┌─────────────────────┴───────────────────────┐  │
│  │        ROUTE LAYER                           │  │
│  │                                              │  │
│  │  /api/v1/auth/*  → authRoutes                │  │
│  │  /api/v1/file/*  → fileRoutes                │  │
│  │  /api/v1/print/* → printRoutes               │  │
│  └──────────────────────────────────────────────┘  │
│                        │                           │
│  ┌─────────────────────┴───────────────────────┐  │
│  │        CONTROLLER LAYER                      │  │
│  │                                              │  │
│  │  authController → register, login            │  │
│  │  qrcodeController → generateQRCode           │  │
│  │  (fileRoutes mein inline bhi logic hai)      │  │
│  └──────────────────────────────────────────────┘  │
│                        │                           │
│  ┌─────────────────────┴───────────────────────┐  │
│  │        DATA LAYER                            │  │
│  │                                              │  │
│  │  Models: userModel, fileModel, qrModel       │  │
│  │  Helper: authHelper (password hash/compare)  │  │
│  │  Utils: cloudinary (upload/delete)           │  │
│  └──────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

## 🗄 Database Architecture

```
MongoDB Database: kawach
│
├── Collection: users
│   {
│     _id: ObjectId,
│     name: "Prince",
│     email: "prince@gmail.com",
│     password: "$2b$10$hashed...",
│     phone: "9876543210",
│     createdAt: ISODate,
│     updatedAt: ISODate
│   }
│
├── Collection: files
│   {
│     _id: ObjectId,
│     filename: "aadhaar.pdf",
│     path: "https://res.cloudinary.com/.../file",  ← Cloudinary URL
│     mimetype: "application/pdf",
│     size: 245760,
│     uploadDate: ISODate,
│     user: ObjectId → users._id,     ← REFERENCE to users collection
│     PublicId: "uploads/abc_aadhaar"  ← Cloudinary delete ke liye
│   }
│
└── Collection: qrcodes
    {
      _id: ObjectId,
      fileId: ObjectId → files._id,   ← REFERENCE to files collection
      qrCode: "https://res.cloudinary.com/.../qr",  ← QR image URL
      fileUrl: "http://localhost:5173/print/...",     ← Print page URL
      createdAt: ISODate
    }

Relationships:
users ──1:N──▶ files (ek user multiple files upload kar sakta hai)
files ──1:1──▶ qrcodes (ek file ka ek QR code)
```

## ☁️ External Services

| Service | URL | Kya kaam karta hai |
|---|---|---|
| **MongoDB Atlas** | mongodb+srv://... | Cloud database (users, files, qrcodes) |
| **Cloudinary** | res.cloudinary.com | Files aur QR images store karta hai |

## 🔑 Authentication Flow — Detail

```
┌──── REGISTRATION ──────────────────────────────────────────┐
│                                                             │
│  Client                        Server                       │
│  ──────                        ──────                       │
│  POST /register ──────────────▶                             │
│  { name, email,                 Validate fields             │
│    password, phone }            Check: email exists?         │
│                                 Hash password (bcrypt 10)    │
│                                 Save to MongoDB              │
│  ◀───────────────────────────── { success: true }           │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌──── LOGIN ─────────────────────────────────────────────────┐
│                                                             │
│  Client                        Server                       │
│  ──────                        ──────                       │
│  POST /login ─────────────────▶                             │
│  { email, password }            Find user by email           │
│                                 Compare password (bcrypt)    │
│                                 Generate JWT:                │
│                                   payload: { _id }           │
│                                   secret: JWT_SECRET          │
│                                   expiry: 2 hours            │
│  ◀───────────────────────────── { user, token }             │
│                                                             │
│  login(user, token)                                         │
│  localStorage.set('token')                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌──── PROTECTED API CALL ────────────────────────────────────┐
│                                                             │
│  Client                        Server                       │
│  ──────                        ──────                       │
│  GET /file/qrcode/123 ────────▶                             │
│  Header: "Bearer eyJ..."       isAuthenticated():           │
│                                   Split "Bearer eyJ..."      │
│                                   jwt.verify(token, SECRET)  │
│                                   req.user = { _id }         │
│                                   next() ✅                  │
│                                 Route handler executes       │
│  ◀───────────────────────────── { success: true, data }     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📱 State Management

Is project mein **React Context API** use hua hai (Redux nahi):

```
AuthContext (Global)
├── user: { _id, name, email, phone } | null
├── fileId: string | null
├── login(user, token) → sets user + stores token
├── logout() → clears user + removes token
└── setFile(id) → stores fileId

Token Storage: localStorage (browser)
├── Set on login
├── Read on every API call
└── Removed on logout
```

---

## 📦 Storage Breakdown — Kya Kahan Save Hai?

Ye sabse important concept hai — **data do jagah save hota hai, par alag-alag cheezein!**

```
┌─────────────────────────────────────────────────────────────────┐
│                    STORAGE BREAKDOWN                            │
├─────────────────────┬───────────────────────────────────────────┤
│     CLOUDINARY      │           MONGODB                        │
│  (Cloud Storage)    │        (Database)                        │
├─────────────────────┼───────────────────────────────────────────┤
│ ✅ Actual file      │ ✅ File ka metadata (naam, size, type)   │
│    (image/PDF)      │ ✅ Cloudinary URL (file kahan hai)       │
│ ✅ QR code image    │ ✅ PublicId (Cloudinary se delete karne   │
│                     │    ke liye)                               │
│                     │ ✅ User reference (kis user ki file hai)  │
│                     │ ✅ QR code ka Cloudinary URL              │
│                     │ ✅ Upload date                            │
└─────────────────────┴───────────────────────────────────────────┘
```

> **Simple Analogy:**
> **Cloudinary = Godown (warehouse)** — yahan asli maal (file) rakha hai
> **MongoDB = Register/Diary** — yahan likha hai ki maal kahan hai, kiska hai, kab aaya

### Cloudinary Folder Structure:

```
Cloudinary Account (djihjoowa)
│
├── 📁 uploads/                          ← Original files yahan jaati hain
│   ├── a3f7b2c9d1e4_resume.pdf
│   ├── 5e8f1a2b3c4d_aadhaar.jpg
│   └── ...
│
├── 📁 qrcodes/                          ← QR code images yahan jaati hain
│   ├── qr_1686123456789_abcdef12.png
│   ├── qr_1686123456790_ghijkl34.png
│   └── ...
```

### MongoDB Collections:

```
MongoDB Database: kawach
│
├── 📋 users collection    → { name, email, password(hashed), phone }
├── 📋 files collection    → { filename, path(cloudinary URL), mimetype, size, user(ref), PublicId, uploadDate }
└── 📋 qrcodes collection  → { fileId(ref), qrCode(cloudinary URL), fileUrl(frontend URL), createdAt }
```

## 🔄 Multi-Actor Flow Diagrams

Ye diagrams dikhate hain ki har operation mein **kaun kaun involved** hai aur data kaise flow karta hai.

### File Upload — Multi-Actor Flow:

```
 USER (Browser)                    SERVER                          CLOUDINARY              MONGODB
      │                              │                                │                      │
      │  1. File select/drop         │                                │                      │
      │  ─────────────────────►      │                                │                      │
      │  POST /api/v1/file/upload    │                                │                      │
      │  (FormData with file)        │                                │                      │
      │                              │                                │                      │
      │                    2. authMiddleware                           │                      │
      │                    JWT token verify                            │                      │
      │                              │                                │                      │
      │                    3. Multer middleware                        │                      │
      │                    file process                                │                      │
      │                              │                                │                      │
      │                              │  4. CloudinaryStorage          │                      │
      │                              │  file upload ─────────────────►│                      │
      │                              │                                │  File saved in       │
      │                              │                                │  "uploads" folder    │
      │                              │  5. URL + PublicId ◄───────────│                      │
      │                              │                                │                      │
      │                              │  6. FileModel.save() ──────────────────────────────►  │
      │                              │  (metadata save)               │                      │
      │                              │                                │                      │
      │                              │  7. generateQRCode()           │                      │
      │                              │     QR buffer create           │                      │
      │                              │     QR upload ─────────────────►│                      │
      │                              │     QRModel.save() ────────────────────────────────►  │
      │                              │                                │                      │
      │  8. Response: { fileId } ◄───│                                │                      │
      │  9. Navigate to /generate-qr │                                │                      │
```

### QR Scan → Print — Multi-Actor Flow:

```
 SCANNER (Phone)        BROWSER                    SERVER                    MONGODB        CLOUDINARY
      │                    │                          │                         │               │
      │ 1. Scan QR         │                          │                         │               │
      │ ──────────────►    │                          │                         │               │
      │ URL: /print/64abc  │                          │                         │               │
      │                    │                          │                         │               │
      │              2. Print.jsx loads                │                         │               │
      │                    │                          │                         │               │
      │                    │ 3. GET /api/v1/print/    │                         │               │
      │                    │     64abc...             │                         │               │
      │                    │ ────────────────────►    │                         │               │
      │                    │                          │                         │               │
      │                    │                    4. FileModel.findById() ───────►│               │
      │                    │                          │                         │               │
      │                    │                    5. Return file data ◄───────────│               │
      │                    │                          │                         │               │
      │                    │ 6. Response ◄────────────│                         │               │
      │                    │ { url, filename }        │                         │               │
      │                    │                          │                         │               │
      │              7. User clicks "Print"           │                         │               │
      │              8. <img src="cloudinaryURL">     │                         │               │
      │                    │ 9. Fetch image ──────────────────────────────────────────────────►│
      │              10. window.print() → Print Dialog│                         │               │
      │              11. After print → /dashboard     │                         │               │
```

### QR Expiration & Auto-Delete — Multi-Actor Flow:

```
 GenerateQR.jsx (Frontend)                    SERVER                    CLOUDINARY        MONGODB
      │                                          │                         │                │
      │  1. QR displayed + Timer starts (20s)    │                         │                │
      │  setInterval every 1 second              │                         │                │
      │      │                                   │                         │                │
      │  2. timeLeft reaches 0                   │                         │                │
      │  handleQRExpiration() called             │                         │                │
      │      │                                   │                         │                │
      │      │ 3. DELETE /api/v1/file/           │                         │                │
      │      │    delete/64abc...                │                         │                │
      │      │ ─────────────────────────────►    │                         │                │
      │      │                                   │                         │                │
      │      │                         4. deleteFileFromCloudinary() ─────►│                │
      │      │                                   │  (delete original file) │                │
      │      │                                   │                         │                │
      │      │                         5. QRModel.findOneAndDelete() ─────────────────────►│
      │      │                                   │                         │                │
      │      │                         6. FileModel.findByIdAndDelete() ──────────────────►│
      │      │                                   │                         │                │
      │      │ 7. Success response ◄─────────────│                         │                │
      │      │                                   │                         │                │
      │  8. Navigate to /dashboard               │                         │                │
      │  toast: "QR expired & file deleted"      │                         │                │
```

> ⚠️ **Important:** Timer **sirf frontend pe** chal raha hai (`GenerateQR.jsx` mein `setInterval`).
> Agar user **tab band kar de ya browser close kar de** timer khatam hone se pehle, toh file **delete nahi hogi**.
> Ye ek known limitation hai — server-side TTL ya cron job se fix ho sakta hai.

---

# 7. Important Concepts Used

## 1. 🏗 MERN Stack
**Kya hai:** MongoDB + Express + React + Node.js — full-stack JavaScript.
**Kyun use kiya:** Frontend aur backend dono mein same language (JavaScript) use hoti hai, development fast hota hai.

## 2. 🛤 REST API
**Kya hai:** Client aur Server ke beech communication ka standard tarika. HTTP methods use hote hain: GET, POST, PUT, DELETE.
**Example:** `POST /api/v1/auth/login` → Login karo. `DELETE /api/v1/file/delete/123` → File delete karo.

## 3. 🔑 JWT (JSON Web Token)
**Kya hai:** Login ke baad server ek encrypted "token" deta hai. Har request ke saath ye token bheja jaata hai taaki server jaane ki "ye authenticated user hai".
**Structure:** `header.payload.signature` (Base64 encoded)
**Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTEifQ.signature`

## 4. 🛡 Middleware Pattern
**Kya hai:** Request aur Response ke beech mein functions lagana jo data process karte hain.
**Analogy:** Socho airport security — pehle ticket check, phir baggage scan, phir boarding. Har step ek middleware hai.
```
Request → cors → json parser → morgan → isAuthenticated → multer → Route Handler → Response
```

## 5. 🔒 Password Hashing (bcrypt)
**Kya hai:** Password ko unreadable form mein convert karna. One-way process hai — hash se original password nahi nikal sakta.
**Salt Rounds = 10:** Jitne zyada rounds, utna slow but secure. 10 ek standard value hai.

## 6. 📁 Multer + Cloudinary Storage
**Multer:** Node.js middleware jo file uploads handle karta hai (multipart/form-data parse karta hai).
**CloudinaryStorage:** Multer ke saath integrate hoke files seedha Cloudinary cloud mein upload karta hai (server ke disk pe save nahi hota).

## 7. 📊 Mongoose ODM
**Kya hai:** MongoDB ke liye Object Data Modeling library. Schema define karo → Model banao → CRUD operations karo.
**Schema:** Data ka blueprint — kaunsa field hai, kya type hai, required hai ya nahi.
**Model:** Schema se created class — isse database mein documents create/read/update/delete karte hain.

## 8. 🧠 React Context API
**Kya hai:** React ka built-in state management. Global state share karne ke liye use hota hai — prop drilling avoid karne ke liye.
**Prop Drilling kya hai:** Parent → Child → GrandChild → ... har level pe props pass karna padta hai. Context se seedha access milta hai.

## 9. 🗺 React Router
**Kya hai:** Client-side routing library. Page refresh ke bina URLs change karta hai aur different components render karta hai.
**Protected Routes:** Kuch routes sirf logged-in users ke liye available hain.

## 10. 🎭 GSAP (GreenSock Animation Platform)
**Kya hai:** Professional-grade animation library. CSS animations se zyada powerful aur smooth.
**Use:** Login card slide up hona, hero text fade in karna, feature cards appear hona.

## 11. 📱 QR Code Generation
**Library:** `qrcode` (backend) — URL leke QR code image generate karta hai.
**Flow:** URL → Buffer (PNG image in memory) → Base64 → Cloudinary upload → URL return.

## 12. 🔗 CORS (Cross-Origin Resource Sharing)
**Kya hai:** Browser security feature. By default, frontend (port 5173) backend (port 8080) ko call nahi kar sakta kyunki different "origin" hain. CORS enable karke ye restriction hataate hain.

## 13. 🌐 Environment Variables (.env)
**Kya hai:** Sensitive data (passwords, API keys) ko code mein hardcode nahi karte — `.env` file mein rakhte hain.
**Frontend:** `VITE_BACKEND_API` → `import.meta.env.VITE_BACKEND_API`
**Backend:** `MONGO_URL`, `JWT_SECRET` → `process.env.MONGO_URL`

## 14. 📦 ES Modules
**Kya hai:** Modern JavaScript module system (`import/export`). `"type": "module"` package.json mein set hai.
**Purana tarika:** `const express = require('express')` (CommonJS)
**Naya tarika:** `import express from 'express'` (ES Modules)

---

# 8. Learning Path

## 🗺 Beginner-Friendly Roadmap — Easiest to Hardest

### Phase 1: Setup Samjho (5 minutes)

| # | File | Kyun Pehle | Kya Sikhoge |
|---|---|---|---|
| 1 | `README.md` | Project ka overview | Problem statement, tech stack |
| 2 | `server/package.json` | Dependencies samjho | Kaunse packages use hue |
| 3 | `client/package.json` | Frontend dependencies | React ecosystem packages |
| 4 | `.env` files (concept) | Config samjho | Environment variables kaise kaam karte hain |

### Phase 2: Backend Foundation (15 minutes)

| # | File | Kyun | Kya Sikhoge |
|---|---|---|---|
| 5 | `server/server.js` | Entry point | Express setup, middleware, routing |
| 6 | `server/config/db.js` | Database connection | Mongoose connect |
| 7 | `server/models/userModel.js` | Sabse simple model | Schema define karna |
| 8 | `server/helper/authHelper.js` | Simple utility | bcrypt hash/compare |

### Phase 3: Auth System (15 minutes)

| # | File | Kyun | Kya Sikhoge |
|---|---|---|---|
| 9 | `server/routes/authRoutes.js` | Routes samjho | Express Router |
| 10 | `server/controllers/authController.js` | Core logic | Register + Login flow |
| 11 | `server/middlewares/authMiddleware.js` | Security samjho | JWT verification |

### Phase 4: Core Feature — File + QR (20 minutes)

| # | File | Kyun | Kya Sikhoge |
|---|---|---|---|
| 12 | `server/models/fileModel.js` | File schema | ObjectId references |
| 13 | `server/models/qrModel.js` | QR schema | Model relationships |
| 14 | `server/middlewares/multer.js` | File upload | Multer + Cloudinary storage |
| 15 | `server/utils/cloudinary.js` | Cloud integration | API integration, buffer handling |
| 16 | `server/controllers/qrcodeController.js` | QR generation | QR code library usage |
| 17 | `server/routes/fileRoutes.js` | Complex routes | Upload, fetch, delete flow |
| 18 | `server/routes/printRoutes.js` | Simple route | File serve karna |

### Phase 5: Frontend Basics (15 minutes)

| # | File | Kyun | Kya Sikhoge |
|---|---|---|---|
| 19 | `client/index.html` | Entry point | HTML structure |
| 20 | `client/vite.config.js` | Build tool | Vite configuration |
| 21 | `client/src/main.jsx` | React start | ReactDOM, Providers, Axios config |
| 22 | `client/src/App.jsx` | Routing | React Router setup |
| 23 | `client/src/context/AuthContext.jsx` | State management | Context API pattern |

### Phase 6: Frontend Components (15 minutes)

| # | File | Kyun | Kya Sikhoge |
|---|---|---|---|
| 24 | `client/src/components/ProtectedRoute.jsx` | Simple guard | Conditional rendering |
| 25 | `client/src/components/Animate.jsx` | UI component | Tailwind CSS |
| 26 | `client/src/pages/Home.jsx` | Landing page | GSAP animations, UI layout |
| 27 | `client/src/pages/Login.jsx` | Form handling | axios, form state, navigation |
| 28 | `client/src/pages/SignUp.jsx` | Similar to Login | Form fields |

### Phase 7: Core UI Pages (20 minutes)

| # | File | Kyun | Kya Sikhoge |
|---|---|---|---|
| 29 | `client/src/pages/Dashboard.jsx` | File upload UI | Drag & drop, FormData, API calls |
| 30 | `client/src/pages/GenerateQR.jsx` | QR display + Timer | useEffect, setInterval, complex state |
| 31 | `client/src/pages/Print.jsx` | Print page | Security measures, window.print() |

**Total Estimated Time:** ~1.5 to 2 hours

---

# 9. Dependency Graph

## Complete Module Dependency Map

```
kawach/
│
├── server/
│   │
│   └── server.js ──────────────────────────────── [ENTRY POINT]
│       ├── config/db.js ────────────────────────── mongoose
│       │
│       ├── routes/authRoutes.js
│       │   ├── controllers/authController.js
│       │   │   ├── models/userModel.js ──────────── mongoose
│       │   │   ├── helper/authHelper.js ──────────── bcrypt
│       │   │   └── jsonwebtoken
│       │   └── middlewares/authMiddleware.js ─────── jsonwebtoken
│       │
│       ├── routes/fileRoutes.js
│       │   ├── middlewares/authMiddleware.js ─────── jsonwebtoken
│       │   ├── middlewares/multer.js
│       │   │   ├── multer
│       │   │   ├── multer-storage-cloudinary
│       │   │   ├── cloudinary (v2)
│       │   │   └── crypto
│       │   ├── models/fileModel.js ──────────────── mongoose
│       │   ├── models/qrModel.js ────────────────── mongoose
│       │   ├── controllers/qrcodeController.js
│       │   │   ├── qrcode
│       │   │   ├── models/qrModel.js
│       │   │   └── utils/cloudinary.js
│       │   │       ├── cloudinary (v2)
│       │   │       └── crypto
│       │   └── utils/cloudinary.js
│       │
│       └── routes/printRoutes.js
│           ├── models/fileModel.js
│           └── middlewares/authMiddleware.js
│
└── client/
    │
    └── src/main.jsx ───────────────────────────── [ENTRY POINT]
        ├── context/AuthContext.jsx ──────────────── React Context API
        │
        └── App.jsx ─────────────────────────────── React Router
            ├── pages/Home.jsx
            │   ├── context/AuthContext (useAuth)
            │   ├── components/Animate.jsx
            │   └── gsap, react-icons
            │
            ├── pages/Login.jsx
            │   ├── context/AuthContext (useAuth)
            │   ├── components/Animate.jsx
            │   ├── axios
            │   └── react-hot-toast, gsap, react-icons
            │
            ├── pages/SignUp.jsx
            │   ├── context/AuthContext (useAuth)
            │   ├── components/Animate.jsx
            │   ├── axios
            │   └── react-toastify, gsap, react-icons
            │
            ├── pages/Dashboard.jsx
            │   ├── context/AuthContext (useAuth)
            │   ├── components/Animate.jsx
            │   ├── axios
            │   └── react-hot-toast, gsap, react-icons
            │
            ├── pages/GenerateQR.jsx
            │   ├── context/AuthContext (useAuth)
            │   ├── components/Animate.jsx
            │   ├── axios
            │   └── react-hot-toast, react-icons
            │
            ├── pages/Print.jsx
            │   ├── axios
            │   └── react-hot-toast, react-icons
            │
            └── components/ProtectedRoute.jsx
                └── context/AuthContext (useAuth)
```

## Visual Dependency Flow (Simplified)

```
           ┌─────────┐
           │ main.jsx │
           └────┬─────┘
                │
     ┌──────────┼──────────┐
     │          │          │
     ▼          ▼          ▼
┌────────┐ ┌───────┐ ┌──────────────┐
│AuthCtx │ │App.jsx│ │ Axios Config │
└────┬───┘ └───┬───┘ └──────────────┘
     │         │
     │    ┌────┴────┬───────┬────────┬──────────┬──────┐
     │    │         │       │        │          │      │
     ▼    ▼         ▼       ▼        ▼          ▼      ▼
   Shared  Home   Login   Signup  Dashboard  GenQR   Print
   by all  .jsx   .jsx    .jsx    .jsx       .jsx    .jsx
   pages    │       │       │        │          │      │
            └───────┴───────┴────────┴──────────┘      │
                          │                             │
                   ProtectedRoute                       │
                   Animate                              │
                          │                             │
                          └──────── axios ──────────────┘
                                     │
                              ┌──────┴──────┐
                              │ Backend API │
                              └─────────────┘
```

---

# 10. Interview Preparation

## ⏱ 30-Second Explanation

> "Kawach ek MERN stack app hai jo **secure document sharing** ka problem solve karta hai. Jaise jab hum print shop pe document dete hain, wo unke system mein save reh jaata hai. Kawach mein user apna document upload karta hai, **ek QR code generate** hota hai, shop wala scan karke print karta hai, aur **20 seconds mein file automatically delete** ho jaati hai. Hum **JWT authentication**, **Cloudinary cloud storage**, aur **one-time QR codes** use karte hain security ke liye."

## ⏱ 2-Minute Explanation

> "Kawach ek **full-stack MERN application** hai — React frontend, Node.js + Express backend, MongoDB database, aur Cloudinary file storage ke saath.
>
> **Problem:** Jab hum kisi print shop pe personal documents dete hain, wo unke computer mein save reh jaate hain — privacy risk hota hai.
>
> **Solution:** Humara flow aise kaam karta hai:
> 1. User **register/login** karta hai — passwords **bcrypt** se hash hoke store hote hain aur **JWT tokens** se authentication hota hai
> 2. Dashboard pe user file **drag-and-drop** ya select karke upload karta hai
> 3. File **Multer middleware** se Cloudinary pe upload hoti hai — server ke disk pe kuch save nahi hota
> 4. Automatically ek **QR code generate** hota hai jo print page ka URL encode karta hai
> 5. QR code bhi **Cloudinary pe save** hota hai aur user ko dikhai deta hai
> 6. Shop owner QR scan karta hai → **Print page** khulta hai → Print karta hai
> 7. **20-second timer** ke baad file Cloudinary aur database dono se **permanently delete** ho jaati hai
>
> **Security features** mein JWT-based route protection, print page pe **right-click/keyboard shortcuts disabled**, aur **auto-deletion** mechanism hai.
>
> **Architecture:** Frontend React Router se 6 pages manage karta hai, Context API se state manage hota hai. Backend Express ke 3 route groups hain — auth, file operations, aur print."

## ⏱ 5-Minute Explanation

> *(2-minute wala explanation bolne ke baad, ye additional details add karo)*
>
> "Main aur detail mein bata deta hoon:
>
> **Frontend Architecture:**
> Humne **Vite** use kiya hai build tool ke roop mein — Create React App se bohot fast hai. **Tailwind CSS** se styling ki hai aur **GSAP animations** se UI smooth banayi hai. **React Context API** se global state manage hota hai — user login state aur current file ID. **React Router v7** se client-side routing handle hota hai aur `ProtectedRoute` component se unauthorized access rokta hai.
>
> **Backend Architecture:**
> Express server pe 3 route groups hain: Auth routes registration aur login handle karte hain. File routes mein upload, QR fetch, aur delete endpoints hain. Print route file details serve karta hai.
>
> **Middleware pipeline** interesting hai — pehle `isAuthenticated` middleware JWT token verify karta hai har protected request pe, phir `multer` with `CloudinaryStorage` file ko directly cloud pe upload karta hai bina server disk pe save kiye.
>
> **Database Design:**
> MongoDB mein 3 collections hain — `users`, `files`, aur `qrcodes`. Files collection mein user reference stored hai (ObjectId), aur qrcodes collection mein file reference. Isse ownership tracking hoti hai — ek user sirf apni files delete kar sakta hai.
>
> **QR Code Flow (Core Feature):**
> Upload ke waqt `qrcode` library se file ka print page URL (`/print/:fileId`) encode hota hai ek PNG image mein. Wo image buffer Cloudinary pe upload hoti hai aur uska URL database mein save hota hai. Frontend pe user generate button click karta hai toh ye URL fetch hoke `<img>` tag mein display hota hai.
>
> **Timer aur Auto-Deletion:**
> QR display hone ke baad 20-second ka `setInterval` timer start hota hai. Timer expire hone pe `handleQRExpiration` function chalta hai jo backend pe DELETE request bhejta hai. Backend pe file Cloudinary se delete hoti hai (pehle image type try karta hai, fail ho toh raw type), QR record MongoDB se delete hota hai, aur file record bhi delete hota hai.
>
> **Print Page Security:**
> Print page pe humnne multiple security layers lagaayi hain — right-click disable, Ctrl+S/P/C blocked, F12 blocked, text selection disabled, drag disabled. Print ke baad window automatically close hota hai aur user dashboard pe redirect hota hai.
>
> **Current Limitations** mein QR expiry sirf client-side timer pe depend karta hai (server-side cron nahi hai), token localStorage mein store hota hai jo XSS vulnerable hai, aur file size limit 10MB hai."

---

## 📝 Possible Interview Questions & Answers

### Q1: "Ye project kya hai aur kya problem solve karta hai?"
**A:** "Kawach ek secure document sharing platform hai. Jab aap print shop pe document dete ho, wo unke system mein reh jaata hai — privacy risk. Kawach mein user file upload karta hai, QR code milta hai, shop wala scan karke print karta hai, aur 20 seconds mein file permanently delete ho jaati hai. Koi trace nahi bachta."

### Q2: "Authentication kaise implement ki hai?"
**A:** "Registration mein bcrypt se password hash karke MongoDB mein store karte hain (salt rounds 10). Login mein email se user dhundhte hain, bcrypt.compare se password verify karte hain, phir JWT token generate karte hain (payload: user._id, expiry: 2 hours). Har protected route pe `isAuthenticated` middleware token verify karta hai aur req.user mein decoded data attach karta hai."

### Q3: "File upload ka flow explain karo."
**A:** "User dashboard pe file select/drop karta hai. Frontend FormData banake `multipart/form-data` header ke saath POST request bhejta hai. Backend pe `isAuthenticated` middleware token check karta hai, phir `multer` middleware with `CloudinaryStorage` file ko directly Cloudinary cloud pe upload karta hai. Server disk pe kuch save nahi hota. Cloudinary se URL aur public_id milta hai jo MongoDB mein `FileModel` mein save hota hai. Saath hi QR code generate hoke separately Cloudinary pe upload hota hai aur `QRModel` mein save hota hai."

### Q4: "QR code kaise generate hota hai aur usme kya encoded hai?"
**A:** "QR code mein file ka direct URL nahi hai — print page ka URL encoded hai (`/print/:fileId`). Backend pe `qrcode` library ka `toBuffer()` method URL se PNG buffer generate karta hai. Buffer ko base64 encode karke Cloudinary pe upload karta hai. QR code ka Cloudinary URL database mein save hoke frontend ko return hota hai."

### Q5: "File deletion / QR expiry kaise kaam karta hai?"
**A:** "Frontend pe 20-second ka `setInterval` timer chalta hai. Timer zero hone pe `handleQRExpiration` function DELETE API call karta hai. Backend pe 3-step deletion hota hai: (1) Cloudinary se file delete (public_id use karke, pehle image type try karta hai, fail ho toh raw type), (2) QRModel se QR record delete, (3) FileModel se file record delete. Ye ensure karta hai ki na Cloudinary pe file rahe, na database mein record."

### Q6: "Middleware kya hota hai aur tumne kahan use kiya?"
**A:** "Middleware ek function hai jo request aur response ke beech mein run hota hai — filtering ya processing ke liye. Humne 4 main middlewares use kiye: (1) `cors` — cross-origin requests allow karne ke liye, (2) `express.json()` — JSON body parse karne ke liye, (3) `isAuthenticated` — JWT token verify karne ke liye, (4) `multer` with CloudinaryStorage — file upload handle karne ke liye. Har middleware `next()` call karke agle middleware/handler ko pass karta hai."

### Q7: "State management kaise ki hai?"
**A:** "React Context API use ki hai. `AuthContext` mein user data, fileId, login/logout/setFile functions hain. `main.jsx` mein `AuthProvider` se poora app wrap hai. Token `localStorage` mein store hota hai. Koi bhi component `useAuth()` hook se global state access kar sakta hai — prop drilling avoid hota hai."

### Q8: "Security measures kya hain?"
**A:** "Multiple layers hain: (1) Passwords bcrypt se hash hote hain, (2) JWT tokens 2 hours mein expire hote hain, (3) Protected routes pe middleware check hota hai, (4) File ownership verify hoti hai delete karte waqt, (5) Print page pe right-click, Ctrl+C/S/P, F12 disabled hain, (6) QR code auto-expire hote hain, (7) Files automatically delete ho jaati hain."

### Q9: "Cloudinary kya hai aur kyun use kiya?"
**A:** "Cloudinary ek cloud-based media management service hai. Humne isliye use kiya kyunki: (1) Server disk pe files save nahi karni chahte the — scalability issues, (2) Cloudinary CDN se fast delivery milti hai, (3) Upload/delete API easy hai, (4) `multer-storage-cloudinary` package se seamless integration milta hai Multer ke saath."

### Q10: "Agar tujhe ye project improve karna ho toh kya karega?"
**A:** *(Section 12 mein detail mein hai — key points:)* "Server-side timer lagaunga QR expiry ke liye (client-side se reliable nahi), httpOnly cookies mein token rakhega (localStorage XSS vulnerable hai), file encryption add karunga, rate limiting lagaunga, aur comprehensive error handling aur input validation improve karunga."

---

## 📝 Additional Deep-Dive Interview Questions

### Q11: "PublicId kya hai aur kyun zaroori hai?"
**A:** "PublicId Cloudinary pe file ka **unique identifier** hai (jaise `uploads/a3f7b2c9d1e4_resume.pdf`). Ye isliye zaroori hai kyunki jab file delete karni hoti hai toh Cloudinary ko `publicId` chahiye — URL se delete nahi hota. Bina PublicId ke hum Cloudinary se file kabhi delete nahi kar payenge. Isliye hum isko MongoDB mein bhi save karte hain."
```javascript
// Delete karte waqt:
await cloudinary.uploader.destroy(publicId); // ← ye PublicId chahiye
```

### Q12: "Multer-storage-cloudinary aur direct Cloudinary SDK mein kya farak hai?"
**A:**

| Feature | multer-storage-cloudinary | Direct Cloudinary SDK |
|---------|--------------------------|----------------------|
| **Kab use** | File upload ke waqt (HTTP multipart) | Programmatic upload (buffer/base64) |
| **Kahan use** | `multer.js` mein — user files ke liye | `cloudinary.js` mein — QR codes ke liye |
| **Kaise kaam** | Multer middleware ke saath integrate | Directly `cloudinary.uploader.upload()` call |
| **Input** | HTTP request se file (`req.file`) | Buffer/base64 string |

Is project mein **dono** use hote hain — user file upload ke liye `multer-storage-cloudinary`, aur QR code upload ke liye direct Cloudinary SDK.

### Q13: "Agar koi seedha `/print/{fileId}` URL open kare bina QR scan kiye toh kya hoga?"
**A:** "Wo page open ho jayega! Print route pe `isAuthenticated` middleware hai, toh agar user logged in hai aur token valid hai toh koi bhi fileId daalke wo file access kar sakta hai. Ye ek **security concern** hai kyunki print route sirf authentication check karta hai, **authorization (file ownership)** check nahi karta. Fix suggestion: Print route mein bhi file ownership verify karo jaise delete route mein karte ho."
```javascript
// printRoutes.js mein — sirf findById hai, user check nahi:
const file = await FileModel.findById(fileId); // ← kisi ka bhi fileId chale jayega!
```

### Q14: "Base64 encoding ka kya role hai QR upload mein?"
**A:** "QR code `qrcode` library se **buffer** (raw binary data) ke roop mein banta hai. Cloudinary ka upload API buffer directly accept nahi karta — usse **Data URI** chahiye. Toh process hai:"
```
Buffer (binary) → Base64 (text) → Data URI → Cloudinary Upload

Example:
Buffer: <89 50 4e 47 ...>
Base64: "iVBORw0KGgo..."
Data URI: "data:image/png;base64,iVBORw0KGgo..."
```

### Q15: "Express mein middleware ka order kyun important hai?"
**A:** "Middleware **sequential** execute hota hai — jo pehle likha wo pehle chalega:"
```javascript
router.post('/upload',
  isAuthenticated,       // 1st: Pehle check karo user logged in hai
  upload.single('file'), // 2nd: Phir file process karo
  async (req, res) => {  // 3rd: Phir business logic
    ...
  }
);
```
"Agar order badal dein (pehle upload, phir auth) toh unauthenticated user bhi file upload kar dega Cloudinary pe — phir auth fail hone pe file orphan ho jayegi."

### Q16: "Frontend pe security measures (right-click disable etc.) kitne effective hain?"
**A:** "**Bilkul effective nahi hain** from a real security perspective! Ye sirf casual users ke liye hain. Koi bhi browser extension se re-enable kar sakta hai, page source view kar sakta hai, network tab se Cloudinary URL nikal sakta hai, ya cURL/Postman se API call karke file download kar sakta hai. **Real security** server-side honi chahiye — jaise signed/temporary Cloudinary URLs, one-time access tokens, etc."

### Q17: "`mongoose.Schema.Types.ObjectId` aur normal `String` mein kya farak hai?"
**A:** "`ObjectId` ek **12-byte unique identifier** hai jo MongoDB automatically generate karta hai. String se farak: (1) ObjectId indexing mein **faster** hai, (2) ObjectId se `.populate()` kar sakte hain (SQL JOIN jaisa), (3) ObjectId ensures ki reference **valid MongoDB document** ki taraf point karta hai, (4) ObjectId ka fixed 24-character hex format hai."

### Q18: "Agar do users same naam ki file upload karein toh clash hoga?"
**A:** "Nahi! Kyunki har file ka `PublicId` unique hai:"
```javascript
// multer.js mein:
public_id: (req, file) => {
  return `${crypto.randomBytes(12).toString('hex')}_${file.originalname}`;
  // Result: "a3f7b2c9d1e4f5a6_resume.pdf"
}
```
"`crypto.randomBytes(12)` se 24-character random hex generate hota hai — practically impossible hai ki do files ka same ID aaye."

### Q19: "FormData kya hai aur kyun use karte hain normal JSON ke bajaye?"
**A:** "Files **binary data** hoti hain — JSON sirf text handle kar sakta hai. `FormData` ek Web API hai jo `multipart/form-data` format mein data bhejti hai — ye text + binary (files) dono handle kar sakti hai. Server pe Multer `multipart/form-data` parse karta hai aur file ko `req.file` mein daal deta hai."
```javascript
// Dashboard.jsx mein:
const formData = new FormData();
formData.append('file', file);  // Binary file add

axios.post('/api/v1/file/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

### Q20: "CORS error kyun aata hai aur kaise fix kiya?"
**A:** "Frontend (`localhost:5173`) aur backend (`localhost:8080`) alag ports pe hain = **different origins**. Browser security ke kaaran cross-origin requests block hoti hain. Fix: Server pe `cors` middleware lagaya with `credentials: true` kyunki frontend Axios mein `withCredentials: true` set tha. Dono sides pe ye match karna zaroori hai."
```javascript
// Server pe:
app.use(cors({ origin: true, credentials: true }));
// Client pe:
axios.defaults.withCredentials = true;
```

### Q21: "DNS fix kyun karna pada — `dns.setServers(['8.8.8.8'])` kyun lagaya?"
**A:** "MongoDB Atlas `mongodb+srv://` connection string use karta hai jo DNS SRV records pe depend karta hai. Windows ke kuch ISP/router ke default DNS servers MongoDB ke SRV records resolve nahi kar paate — `ECONNREFUSED` error aata hai. Fix: Node.js ke DNS resolver ko Google DNS (8.8.8.8) pe point kar diya taaki SRV record correctly resolve ho."
```javascript
// db.js mein:
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']); // Google Public DNS
```

### Q22: "Agar Cloudinary down ho jaaye toh kya hoga?"
**A:** "(1) **Upload** fail ho jayega kyunki `multer-storage-cloudinary` upload nahi kar payega. (2) **QR Code** generate nahi hoga kyunki QR image bhi Cloudinary pe upload hoti hai. (3) **Print** fail hoga kyunki `<img src='cloudinaryURL'>` load nahi hoga. (4) **MongoDB data safe rahega** kyunki wo alag service pe hai."

### Q23: "Is project mein kitne API endpoints hain?"
**A:**

| Method | Endpoint | Purpose | Auth? |
|--------|----------|---------|-------|
| POST | `/api/v1/auth/register` | New user registration | ❌ |
| POST | `/api/v1/auth/login` | User login, JWT return | ❌ |
| POST | `/api/v1/file/upload` | File upload to Cloudinary | ✅ |
| GET | `/api/v1/file/qrcode/:fileId` | QR code fetch | ✅ |
| DELETE | `/api/v1/file/delete/:fileId` | File + QR delete | ✅ |
| GET | `/api/v1/print/:fileId` | Get file data for printing | ✅ |

### Q24: "File delete hone pe Cloudinary se kaise delete hoti hai?"
**A:** "`cloudinary.js` mein `deleteFileFromCloudinary()` function hai jo **2 attempts** karta hai: (1) Pehle **image** type mein delete try karta hai — `cloudinary.uploader.destroy(publicId)`. (2) Agar fail ho toh **raw** type mein try karta hai — `cloudinary.uploader.destroy(publicId, { resource_type: 'raw' })`. Ye isliye kyunki images aur documents (PDF etc.) Cloudinary mein alag `resource_type` pe stored hote hain."

### Q25: "Ye project scale karne ke liye kya changes karne padenge?"
**A:** "10 key changes: (1) Server-side timer — Redis ya MongoDB TTL index se file auto-expire, (2) Signed Cloudinary URLs — temporary URLs jo time-limited hain, (3) Rate limiting — `express-rate-limit` middleware, (4) JWT expiry — token mein `expiresIn: '24h'`, (5) File encryption — upload se pehle encrypt, print ke waqt decrypt, (6) Load balancer — multiple server instances, (7) File ownership on print — print route mein bhi user check, (8) Logging & monitoring — Winston + health checks, (9) Environment management — different .env for dev/staging/prod, (10) Docker containerization."

## 🎯 Quick Revision Table — Concept → File → Kya Karta Hai

| Concept | File | Kya Karta Hai |
|---------|------|---------------|
| File Upload | `multer.js` + `CloudinaryStorage` | File → Cloudinary "uploads/" folder |
| File Metadata | `fileModel.js` + `fileRoutes.js` | URL, size, type → MongoDB "files" collection |
| QR Generation | `qrcodeController.js` | URL → QR image buffer |
| QR Upload | `cloudinary.js` → `uploadQRCodeBuffer()` | QR buffer → Cloudinary "qrcodes/" folder |
| QR Metadata | `qrModel.js` | QR URL, file ref → MongoDB "qrcodes" collection |
| Auth | `authMiddleware.js` + `AuthContext.jsx` | JWT verify + user state management |
| Print | `Print.jsx` + `printRoutes.js` | File fetch → Display → Browser print dialog |
| Auto-Delete | `GenerateQR.jsx` → `handleQRExpiration()` | Timer → DELETE API → Cloudinary + MongoDB cleanup |
| Password Security | `bcrypt` in auth routes | Hash on register, compare on login |
| DNS Fix | `db.js` → `dns.setServers()` | Google DNS for MongoDB Atlas SRV resolution |

---

# 11. Code Walkthrough Notes — 10-Minute Revision

## ⚡ Quick Reference Card

### Tech Stack
```
Frontend: React + Vite + Tailwind CSS + GSAP + Axios
Backend: Node.js + Express.js + Mongoose + JWT + bcrypt + Multer
Database: MongoDB (3 collections: users, files, qrcodes)
Cloud: Cloudinary (files + QR images)
```

### 3 Database Collections
```
users    → { name, email, password(hashed), phone }
files    → { filename, path(cloudinary), mimetype, size, user(→users), PublicId }
qrcodes  → { fileId(→files), qrCode(cloudinary), fileUrl(print URL) }
```

### 3 Route Groups
```
/api/v1/auth/register  → POST → New user (bcrypt hash)
/api/v1/auth/login     → POST → JWT token return
/api/v1/file/upload    → POST → Multer→Cloudinary + QR generate
/api/v1/file/qrcode/:id → GET → QR code URL fetch
/api/v1/file/delete/:id → DELETE → Cloudinary + DB cleanup
/api/v1/print/:id       → GET → File details for printing
```

### 6 Frontend Pages
```
Home → Landing page (features, stats, CTA buttons)
Login → Email + Password → JWT token → localStorage
SignUp → Name + Email + Password + Phone → Register
Dashboard → File upload (drag/drop) → Auto navigate to QR
GenerateQR → Fetch QR → Display → 20s timer → Auto-delete
Print → Security locks → Fetch file → Print → Close
```

### Auth Flow (3 Steps)
```
1. Login → Server returns { user, token }
2. Token saved → localStorage.setItem('token', token)
3. Every API call → Header: "Authorization: Bearer <token>"
   → isAuthenticated middleware verifies → req.user = { _id }
```

### Core Feature Flow (7 Steps)
```
1. User uploads file on Dashboard
2. Multer + CloudinaryStorage → File on Cloudinary
3. FileModel saved in MongoDB (with Cloudinary URL)
4. QR code generated (encodes print page URL)
5. QR image uploaded to Cloudinary
6. QRModel saved in MongoDB
7. Frontend displays QR + starts 20s timer → auto-delete
```

### Key Middleware Chain
```
Request → cors → express.json → morgan → isAuthenticated(JWT) → multer(file) → Handler
```

### Security Measures
```
✅ bcrypt password hashing (10 salt rounds)
✅ JWT token auth (2hr expiry)
✅ Protected routes (ProtectedRoute component + isAuthenticated middleware)
✅ File ownership check (user can only delete own files)
✅ Print page: right-click, Ctrl+C/S/P, F12, select, drag — all disabled
✅ Auto-deletion after QR timer expires
```

---

# 12. Improvements

## 🔴 Current Limitations

### 1. Client-Side Timer Only
**Problem:** QR expiry timer sirf frontend pe chalta hai. Agar user browser band kar de toh file delete nahi hogi!
**Solution:** Backend pe **cron job** ya **TTL index** lagao MongoDB mein. Mongo ka TTL feature automatically documents delete kar sakta hai specified time ke baad.
```javascript
// MongoDB TTL Index example
createdAt: { type: Date, default: Date.now, expires: 20 } // 20 seconds mein auto-delete
```

### 2. Token in localStorage (XSS Vulnerable)
**Problem:** JWT token `localStorage` mein hai. Agar XSS attack ho toh attacker token chura sakta hai.
**Solution:** **httpOnly cookies** mein token rakhna — JavaScript se access nahi ho sakta.

### 3. No Token Persistence on Refresh
**Problem:** User state sirf React state mein hai. Page refresh hone pe user logout ho jaata hai (token hai localStorage mein but user state reset ho jaata hai).
**Solution:** App start pe localStorage se token read karo, verify karo, aur user state set karo.

### 4. SignUp Bug
**Problem:** SignUp ke baad `navigate('/dashboard')` hota hai but `login()` call nahi hota — user dashboard pe jaayega but logged in nahi hoga, `ProtectedRoute` login pe redirect kar dega.
**Solution:** SignUp ke baad login pe redirect karo, ya auto-login implement karo.

## 🟡 Scalability Issues

### 1. No Rate Limiting
**Problem:** Koi bhi unlimited requests bhej sakta hai — DDoS attack possible.
**Solution:** `express-rate-limit` package use karo.

### 2. No File Type Validation (Server-Side)
**Problem:** Multer mein `allowed_formats` hai but ye Cloudinary level pe hai. Malicious files upload ho sakti hain.
**Solution:** Backend pe file type, magic bytes, aur content validate karo.

### 3. Single Server
**Problem:** Ek hi server hai — agar crash ho jaaye toh sab band.
**Solution:** Load balancer + multiple instances deploy karo.

### 4. No Pagination
**Problem:** Agar bohot files ho toh sab ek saath load hongi.
**Solution:** Pagination implement karo API mein.

## 🟡 Security Issues

### 1. Print Route Authentication
**Problem:** Print route pe `isAuthenticated` hai — matlab sirf logged-in users hi print kar sakte hain. But shop owner ka account hona chahiye? Ye flow confusing hai.
**Solution:** Print route ke liye alag authentication mechanism banao — jaise one-time access token.

### 2. Console Logs in Production
**Problem:** `console.log` se sensitive data (connection strings, user IDs) log ho raha hai.
**Solution:** Production mein console logs remove karo ya proper logging library (winston) use karo.

### 3. CORS Wide Open
**Problem:** `origin: true` — koi bhi domain se requests allowed hain.
**Solution:** Sirf trusted domains allow karo: `origin: ['http://localhost:5173', 'https://your-domain.com']`

### 4. No Input Sanitization
**Problem:** User input directly database mein jaa raha hai — NoSQL injection risk.
**Solution:** `express-mongo-sanitize` package use karo.

### 5. No HTTPS
**Problem:** Data plain HTTP mein travel karta hai — interceptable hai.
**Solution:** SSL/TLS certificate lagao (production mein).

## 🟢 Performance Bottlenecks

### 1. QR Code Generation on Upload
**Problem:** File upload ke saath hi QR generate hota hai — response time zyada lagta hai.
**Solution:** QR generation ko **background job** mein daalo (Bull queue) aur status polling ya WebSocket se update do.

### 2. No Caching
**Problem:** Har request pe database query hoti hai.
**Solution:** Redis caching lagao frequently accessed data ke liye.

### 3. No Image Optimization
**Problem:** QR code images as-is serve hoti hain.
**Solution:** Cloudinary ke built-in transformations use karke optimized images serve karo.

## 🔵 Possible Improvements

| # | Improvement | Impact | Difficulty |
|---|---|---|---|
| 1 | Server-side TTL for auto-deletion | 🔴 Critical | Medium |
| 2 | httpOnly cookie tokens | 🔴 Critical | Easy |
| 3 | Token persistence on refresh | 🟡 High | Easy |
| 4 | Fix SignUp → Login flow | 🟡 High | Easy |
| 5 | Rate limiting | 🟡 High | Easy |
| 6 | Input sanitization | 🟡 High | Easy |
| 7 | Error boundary in React | 🟡 Medium | Easy |
| 8 | Loading states / skeleton UI | 🟢 Low | Easy |
| 9 | File encryption before upload | 🔴 Critical | Hard |
| 10 | Email verification on signup | 🟡 Medium | Medium |
| 11 | Password reset functionality | 🟡 Medium | Medium |
| 12 | Admin dashboard | 🟢 Low | Medium |
| 13 | Multiple file upload | 🟢 Low | Medium |
| 14 | File preview before print | 🟢 Low | Easy |
| 15 | Download count / scan tracking | 🟢 Low | Easy |
| 16 | One-time access link for print (no login needed) | 🟡 High | Medium |
| 17 | Toast library consistency (use one: react-hot-toast OR react-toastify) | 🟢 Low | Easy |

---

## 🎉 Congratulations!

Agar tumne ye poora document padh liya hai, toh tum **Kawach project ko ache se samajh gaye ho**! Ab tum confidently:
- ✅ Har file ka purpose bata sakte ho
- ✅ Complete flow explain kar sakte ho
- ✅ Architecture draw kar sakte ho
- ✅ Interview mein 30s, 2min, 5min mein project explain kar sakte ho
- ✅ Improvements suggest kar sakte ho

**Best of luck for your interviews!** 🚀
