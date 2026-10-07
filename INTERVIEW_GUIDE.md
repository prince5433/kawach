# KAWACH — Compact But Complete Interview Guide

> Repository-verified notebook. Easy Hinglish. Current behavior, limitations and future design clearly separate.

## Contents

1. [Project Overview](#section-1)
2. [Architecture + Folder Structure](#section-2)
3. [Tech Stack](#section-3)
4. [Complete End-to-End Flow](#section-4)
5. [Important APIs](#section-5)
6. [Database](#section-6)
7. [Authentication + Authorization](#section-7)
8. [QR + Expiry + Deletion](#section-8)
9. [Cloudinary + Multer + Storage](#section-9)
10. [Security](#section-10)
11. [Performance + Scalability](#section-11)
12. [Failure + Debugging](#section-12)
13. [Resume Defense](#section-13)
14. [Configuration + Deployment + Testing](#section-14)
15. [Top Interview Questions](#section-15)
16. [Cross-Questioning](#section-16)
17. [Mock Interview](#section-17)
18. [Rapid Fire](#section-18)
19. [Final 10-Minute Revision](#section-19)

<a id="section-1"></a>

## 1. Project Overview

Kawach ek **MERN document-sharing aur browser-printing prototype** hai.
User login karke document Cloudinary par upload karta hai.
Backend print-page URL ka QR PNG banata hai.
Owner ki QR screen 20-second browser countdown ke baad deletion request try karti hai.

**Problem:** Print shop ko document dene ke baad unnecessary saved copies ka privacy risk hota hai.
Kawach is risk ko target karta hai; complete copy prevention prove nahi karta.

**Solution boundary:** JWT login, bcrypt passwords, cloud uploads aur kuch ownership checks present hain.
Guaranteed one-time access, server-side 60-second expiry, AES links aur zero retention present nahi.

🎤 **20–30 second answer:**
“Kawach MERN document-sharing prototype hai. Login ke baad file cloud mein jaati hai aur print URL ka QR milta hai.
Browser countdown cleanup request bhejta hai; secure one-time access aur reliable server cleanup abhi improve karne hain.”

**How to study:** Section 4 se journey samjho. Sections 7–10 se auth, QR aur security padho.
Section 13 se resume wording defend karo. Sections 15–19 interview practice hain.

**Evidence boundary:** Source checkout HEAD `78e96c0`; verified audit date 7 October 2026.
This refactor existing verified guide ko consolidate karta hai; application behavior change nahi karta.
Earlier audit: frontend build pass; lint 26 errors / 2 warnings; backend JS syntax pass.
Live DB/cloud deletion, hosted deployment, exploit reproduction aur physical printing unverified hain.

| Label | Meaning |
|---|---|
| [IDENTIFIED LIMITATION] | Source mein actual gap |
| [RECOMMENDED IMPROVEMENT] | Future design, current feature nahi |
| [NOT VERIFIED FROM REPOSITORY] | Evidence available nahi |
| [RESUME CLAIM — VERIFY BEFORE INTERVIEW] | Resume wording ko implementation se match karna hai |

### Current feature boundary

YES means this exact behavior is present; overall security guarantee nahi. NOT VERIFIED means test evidence absent.

| Claim | Current Kawach? |
|---|---|
| Login | YES |
| JWT authentication | YES |
| bcrypt password hashing | YES |
| Owner check on QR fetch | YES |
| Owner check on delete | YES |
| Print owner authorization | NO |
| True one-time QR | NO |
| Server-side 60-sec expiry | NO |
| Browser 20-sec countdown | YES |
| AES document encryption | NO |
| E2E encryption | NO |
| Cloud cleanup attempt | YES |
| Guaranteed cloud deletion | NO |
| QR cloud asset deletion | NO |
| Zero data retention | NO |
| Six configured format names | YES |
| Six formats actually evaluated | NOT VERIFIED |
| Server logout/revocation | NO |
| Refresh token | NO |
| Rate limiting | NO |
| Antivirus scanning | NO |
| Redis | NO |
| Queue/worker | NO |
| Docker | NO |
| CI/CD | NO |

<a id="section-2"></a>

## 2. Architecture + Folder Structure

```text
React SPA + Router + AuthContext
      │ Axios HTTP; protected calls carry Bearer JWT
      ▼
Node / Express API
      ├── MongoDB: users, File metadata, QRCode metadata
      └── Cloudinary: original asset + QR PNG
```

Single Express app hai; separate microservices nahi.
Models aur kuch controllers separate hain, but file/print business logic route files mein hai.
Isliye “loosely MVC” bolo, pure clean service-layer architecture nahi.

```text
kawach/
  client/src/
    main.jsx, App.jsx
    context/AuthContext.jsx
    components/ProtectedRoute.jsx
    pages/Home.jsx, Login.jsx, SignUp.jsx, Dashboard.jsx, GenerateQR.jsx, Print.jsx
  server/
    server.js, config/db.js
    controllers/authController.js, qrcodeController.js
    routes/authRoutes.js, fileRoutes.js, printRoutes.js
    middlewares/authMiddleware.js, multer.js
    helper/authHelper.js, utils/cloudinary.js
    models/userModel.js, fileModel.js, qrModel.js
```

### Important file cards

Har card: **What → Why → Important implementation → Interview point**.
Source links same repository files kholti hain.

#### [client/src/main.jsx](client/src/main.jsx)

**What:** React mount aur app-wide defaults. **Why:** Provider aur Axios setup ek entry par.

**Implementation:** AuthProvider wraps App; baseURL VITE_BACKEND_API; withCredentials true. StrictMode import unused.

**Interview point:** Token explicit header se jaata hai; withCredentials JWT add nahi karta.

#### [client/src/App.jsx](client/src/App.jsx)

**What:** UI routes define karta hai. **Why:** URL ke basis par correct page show karna.

**Implementation:** Home/Login/Signup public; Dashboard/GenerateQR guarded; Print frontend public; wildcard Home.

**Interview point:** Public frontend page ka backend API public hona zaroori nahi.

#### [client/src/context/AuthContext.jsx](client/src/context/AuthContext.jsx)

**What:** user aur fileId share karta hai. **Why:** Pages ke beech current identity/upload ID pass karna.

**Implementation:** login sets user and localStorage token; setFile stores ID; logout clears user/token, not fileId.

**Interview point:** Refresh pe context resets; token bachta hai, auth restoration absent.

#### [client/src/components/ProtectedRoute.jsx](client/src/components/ProtectedRoute.jsx)

**What:** Missing context user ko login redirect. **Why:** Dashboard/QR UI guard.

**Implementation:** user ? children : Navigate(login); actual token validity check nahi.

**Interview point:** UI wrapper security boundary nahi; API checks required.

#### [client/src/pages/Login.jsx](client/src/pages/Login.jsx)

**What:** Controlled email/password form aur login call. **Why:** User identity establish karna.

**Implementation:** POST login success → context.login → dashboard. Stay signed in checkbox unwired; forgot password #.

**Interview point:** Remember-me aur password-reset workflows implemented nahi.

#### [client/src/pages/SignUp.jsx](client/src/pages/SignUp.jsx)

**What:** Account registration form. **Why:** New account create karna.

**Implementation:** POST register; success navigate dashboard; login() never called.

**Interview point:** Fresh session dashboard guard login redirect karega; signup auto-login nahi.

#### [client/src/pages/Dashboard.jsx](client/src/pages/Dashboard.jsx)

**What:** File selection/drop aur logout UI. **Why:** Upload ka user entry point.

**Implementation:** First file immediately upload; FormData file; explicit JWT; setFile; navigate QR.

**Interview point:** No upload progress/lock/client type-size validation; failed selectedFile reset absent.

#### [client/src/pages/GenerateQR.jsx](client/src/pages/GenerateQR.jsx)

**What:** Stored QR image/details fetch aur countdown. **Why:** Owner ko sharing UI dena.

**Implementation:** GET qrcode; starts 20 seconds; interval deletion attempt; loading/error unused in render; logout undefined on 401.

**Interview point:** Generate button fetch karta hai; source bug aur expiry distinction section 8.

#### [client/src/pages/Print.jsx](client/src/pages/Print.jsx)

**What:** File metadata fetch aur image popup printing. **Why:** Scanner browser ka print UI.

**Implementation:** Param fileId + own JWT; window.open; img onload print; afterprint/timeout close/redirect.

**Interview point:** MIME ignored; PDF/DOC renderer absent; printing consumes/deletes nothing.

#### [server/server.js](server/server.js)

**What:** Express app, middleware aur route mounts. **Why:** Backend process entry point.

**Implementation:** CORS→JSON→urlencoded→static public→Morgan→routers; EJS set; PORT env or 8080; connectDb not awaited.

**Interview point:** Listener DB ready hone se pehle start ho sakta hai; EJS render route absent.

#### [server/config/db.js](server/config/db.js)

**What:** Configured MongoDB connect. **Why:** Persistent metadata access.

**Implementation:** dns.setServers Google resolvers; mongoose.connect MONGO_URL; catch logs only; full URI logged.

**Interview point:** Connection-string logging risky; DB failure process exit nahi karti.

#### [server/controllers/authController.js](server/controllers/authController.js)

**What:** registerController, loginController, testController. **Why:** Account writes aur JWT issuing.

**Implementation:** Presence checks, email query, bcrypt helper, user save; login signs 2h; test returns plain text.

**Interview point:** Registration returns hash; auth app parsers ka extra local Express instance mounted server nahi.

#### [server/helper/authHelper.js](server/helper/authHelper.js)

**What:** hashPassword aur comparePassword. **Why:** Password handling reusable rakhna.

**Implementation:** bcrypt.hash(password,10); compare returns promise; hash error logged/swallowed.

**Interview point:** Cost10 password hash hai; AES nahi. Hash failure propagate karna chahiye.

#### [server/middlewares/authMiddleware.js](server/middlewares/authMiddleware.js)

**What:** isAuthenticated token verify. **Why:** Protected API identity check.

**Implementation:** Authorization split second item → jwt.verify → req.user → next. No token 401, invalid/expired 400.

**Interview point:** Strict Bearer prefix, user existence, issuer/audience policy explicit nahi; commented admin code inactive.

#### [server/middlewares/multer.js](server/middlewares/multer.js)

**What:** Multipart upload/storage config. **Why:** Incoming file stream handle karna.

**Implementation:** CloudinaryStorage uploads folder; six format names;10 MiB; random12-byte prefix plus originalname.

**Interview point:** No custom fileFilter/content scan; middleware errors route try se pehle.

#### [server/routes/authRoutes.js](server/routes/authRoutes.js)

**What:** Register/login/test router. **Why:** Auth endpoints mount karna.

**Implementation:** Two public POST controllers; GET test uses isAuthenticated.

**Interview point:** Logout, me/profile, reset aur refresh API absent.

#### [server/routes/fileRoutes.js](server/routes/fileRoutes.js)

**What:** Upload, owner QR fetch, owner delete. **Why:** Document workflow coordinate karna.

**Implementation:** Auth before Multer; File save before QR; QR/delete query includes user; delete helper result unchecked.

**Interview point:** Multi-system sequence atomic nahi; cleanup failure details section 8.

#### [server/routes/printRoutes.js](server/routes/printRoutes.js)

**What:** Print metadata API. **Why:** Print page ko stored file URL dena.

**Implementation:** JWT middleware then File.findById; returns url/filename/mimetype.

**Interview point:** No owner/share/expiry/consume check; print permission gap.

#### [server/controllers/qrcodeController.js](server/controllers/qrcodeController.js)

**What:** generateQRCode(fileId,fileUrl). **Why:** Print URL ki scannable PNG banana.

**Implementation:** qrcode.toBuffer H/png/margin1; cloud QR upload; QR record save; response.url return.

**Interview point:** Parameter fileUrl actually frontend print URL hai, original cloud URL nahi.

#### [server/utils/cloudinary.js](server/utils/cloudinary.js)

**What:** Cloud config, QR upload aur original delete helper. **Why:** External asset operations central rakhna.

**Implementation:** generatePublicId; base64 data URI upload; image→raw destroy; failure returns success:false.

**Interview point:** Resolved promise successful deletion prove nahi; asset type/QR ID tracking missing.

#### [server/models/userModel.js](server/models/userModel.js)

**What:** Account schema. **Why:** Required identity/password metadata shape.

**Implementation:** Model name users; required name/email/password/phone; email unique; timestamps.

**Interview point:** Model name User nahi; File ref mismatch section 6.

#### [server/models/fileModel.js](server/models/fileModel.js)

**What:** Original-file metadata schema. **Why:** Owner aur cloud retrieval/deletion data store.

**Implementation:** File model; user ref User; required PublicId; path/content optional; uploadDate default.

**Interview point:** No share expiry/consume fields; content Buffer unused.

#### [server/models/qrModel.js](server/models/qrModel.js)

**What:** QR metadata schema. **Why:** File aur generated QR image relate karna.

**Implementation:** QRCode model; fileId ref File; qrCode image URL; fileUrl print URL; createdAt.

**Interview point:** No expiresAt/usedAt/secret token/QR public_id/unique fileId.

### Frontend ke remaining meaningful details

Home landing CTA hai; encryption/uptime/1M+/monitoring cards static claims hain, verified capabilities nahi.
Animate reusable CSS background hai; GSAP page presentation animate karta hai, security feature nahi.
Print select/drag anonymous listeners different callbacks se remove hote hain; cleanup reliable nahi.
Hot-toast Toaster only GenerateQR mein mila; Signup toastify use karti hai but ToastContainer absent.
Notifications other pages par consistently visible assume mat karo.
Style/sample assets ke microscopic details interview ke liye needed nahi; build config section 14 mein hai.

<a id="section-3"></a>

## 3. Tech Stack

Ye **one consolidated stack table** hai; separate repeated glossary nahi.
“Why” practical fit explain karta hai; original personal design decision Git se automatically prove nahi.

| Technology | Easy Meaning | Kawach Use | Why Used | Alternative | Why Not Alternative | 🎤 One Interview Answer |
|---|---|---|---|---|---|---|
| React / React DOM | UI ko components mein banana | Pages/hooks/createRoot | Forms aur changing UI manage karna | Vanilla JS | Vanilla valid; DOM/state manually manage karni padegi | React se pages ko components mein todte hain. Forms aur state ka UI update simple hota hai. |
| Node.js | Server par JavaScript chalana | ES module API; node server.js | UI/API same language aur async I/O | Python / Java | Dono valid; prototype ko another language/toolchain ki need prove nahi | Node se backend bhi JS mein hai. Python/Java bhi use kar sakte the; Node ko universally faster nahi bolunga. |
| Express | Request ko handlers tak le jaana | Routes/parsers/middleware | Small API mein auth/upload chain simple | Another backend framework | More features/control possible; current API ko framework change required nahi | Express routes aur middleware connect karta hai. Is prototype ke small HTTP API ke liye simple fit hai. |
| MongoDB | Records documents mein rakhna | Account/file/QR metadata | Document-shaped metadata simple map hota hai | PostgreSQL | SQL relations useful; current metadata ke liye both valid | MongoDB mein file ki metadata entries hain. PostgreSQL bhi valid hai; Mongo ko always faster nahi bolunga. |
| Mongoose | Mongo ke JS models aur field rules | Schemas/casting/queries | Required fields aur model queries ek jagah | Native MongoDB driver | Driver valid; field rules/mapping more manually handle karne honge | Mongoose schemas aur queries organize karta hai. Native driver se ye rules khud maintain karne padte. |
| Vite | UI dev server aur build tool | React plugin; dev/build scripts | Frontend development aur bundle setup | CRA / another bundler | Other tooling possible; project already Vite use karta hai; measured speed comparison absent | Vite frontend run aur build karta hai. Repo-specific speed benchmark nahi; current setup simple hai. |
| Tailwind | Ready CSS utility classes | Responsive page styling | Same style rules classes se compose | Plain CSS / CSS modules | Both valid; separate CSS rules bhi maintain kar sakte the | Tailwind classes se responsive styling hoti hai. Plain CSS bhi valid hai; JSX classes lambi ho sakti hain. |
| JWT | User identity ka signed token | Login sign; middleware verify | Identity verify without separate session map | Server-side sessions | Session ID lookup/store chahiye; revocation easier ho sakti hai | JWT signed user identity deta hai. Session mein server ID ke against state rakhta hai; JWT revocation harder hai. |
| bcrypt | Password ka one-way checkable hash | hash cost 10; compare | Plain password store avoid | Plaintext / encryption / another password hash | Plaintext/key risks avoid; other password hashes valid, choice history unverified | bcrypt password hash store karta hai. Login compare karta hai; original password decrypt karna required nahi. |
| Multer | File wali multipart request parse karna | single(file); 10 MiB cap | File stream aur upload errors handle | Manual multipart parsing | Possible but boundaries/streams/limits more code se handle honge | Multer file request parse karta hai. Manually multipart likhne ki jagah ready middleware use hua hai. |
| multer-storage-cloudinary | Multer se cloud upload ka adapter | upload stream; response mapping | Storage integration code reduce | Manual upload_stream | More validation/type control, but stream/metadata handling khud likhna hoga | Adapter stream Cloudinary ko bhejta aur metadata map karta hai. Manual stream possible; current peer mismatch review needed. |
| Cloudinary | Cloud mein asset aur delivery URL | Original document/QR PNG | Upload/delete APIs; no app permanent disk storage | Local disk / S3/private object storage | Disk persistence/replicas manage karne padte; S3 strong private-storage alternative | Cloudinary storage integration simple hai. Local disk management extra hai; S3 private documents ke liye valid alternative. |
| QRCode | URL ki scan-friendly image | Server PNG; H correction | Phone se long URL type nahi karna | Normal URL | Normal link equally valid; QR only scanning convenience | QR se print URL scan hota hai. Normal link bhi same route khol sakta hai; QR extra security nahi deta. |
| Axios | Browser se API request bhejna | Page calls; baseURL/defaults | Common request setup ek jagah | fetch | fetch perfectly valid; base URL and error behavior khud handle kar sakte hain | Axios mein baseURL/defaults set hain. fetch bhi valid tha; Axios convenience hai, universally better nahi. |
| React Context API | Small state pages ko share karna | user/fileId; login/logout/setFile | Prop passing reduce; few shared values | Redux | Redux valid; this small state ke liye extra setup necessary nahi | Kawach ki shared state mainly user aur fileId hai. Context enough hai; complex state ho toh Redux consider karenge. |
| React Router | URL se UI page choose karna | App routes; navigate/params | Route mapping and navigation organize | Manual history/path handling | Possible; URL matching, navigation and params khud maintain karne honge | Router URL ke hisaab se page dikhata hai. Manually routes manage karne se extra code hota. |
| CORS | Browser ko other origin response allow | origin:true; credentials:true | Frontend/API different origins | Same-origin hosting | Same-origin possible; current separate setup needs browser policy | CORS browser response access allow karta hai. Ye auth, file permission ya curl-blocking firewall nahi. |
| dotenv | Config values .env se process mein load | Server DB/JWT/cloud config | Secrets source mein hardcode avoid | Deployment-injected environment | Production env injection valid; dotenv local loading convenient | dotenv local config load karta hai. Secrets hardcode nahi karne; env values bhi logs mein leak ho sakti hain. |
| Morgan | HTTP requests ka log | morgan(dev) always enabled | Method/path/status debug karna | Manual / structured request logger | Alternatives valid; structured logs better correlation de sakte hain | Morgan request log karta hai. Current dev format always on hai; full monitoring or secret redaction guarantee nahi. |
| GSAP | UI elements animate karna | Page timelines; Dashboard ref | Stagger/sequence animations compose | CSS animations | CSS simple effects ke liye sufficient; Animate already CSS uses | GSAP animations ke liye hai. Simple effect CSS se bhi hota; GSAP security se related nahi. |
| PostCSS / Autoprefixer | Build ke time CSS process karna | Tailwind/PostCSS config | CSS pipeline aur needed browser prefixes | Manual CSS processing/prefixes | Manual possible; browser prefix rules khud maintain karne honge | PostCSS CSS process karta hai. Autoprefixer required browser prefixes add karta hai; backend security ka tool nahi. |

**Other supporting tools:** colors console appearance; icons/toasts UI feedback.
ESLint code quality checks; React Vite plugin JSX tooling.
Table practical fit explain karti hai; original personal choice/history unverified rahega.
jsqr/qrcode.react dependencies declared but camera scanner/client QR generator imported nahi.
EJS view engine configured; rendered template route absent.
Node crypto.randomBytes random IDs ke liye; AES encrypt/decrypt pipeline nahi.

**Easy async meaning:** Promise future result ka container hai. await result tak function pause karta hai.
I/O wait ke time Node other requests handle kar sakta hai; CPU work automatic parallel nahi hota.
Resolved success:false rejection nahi; try/catch ke saath explicit result check bhi chahiye.

<a id="section-4"></a>

## 4. Complete End-to-End Flow

### Ek image document ka poora journey

Socho user `sample.png` print karwana chahta hai. Ye example filename hai; runtime result ka claim nahi.

1. User Home se signup par jaata hai. Name/email/password/phone register API ko jaate hain. bcrypt hash banta hai. `users` model save hota hai. Signup token nahi deta. UI dashboard bhejti hai, fresh user ka guard login par redirect karta hai.
2. Login par email query aur bcrypt compare hota hai. Backend `_id` payload ka signed JWT deta hai. Lifetime two hours. Context mein user aur localStorage mein token jaata hai.
3. Dashboard par file choose/drop hote hi upload start. `FormData.append('file', file)` request body banata hai. JWT alag Authorization header mein jaata hai; file body mein token nahi.
4. Express middleware request handle karta hai. `isAuthenticated` JWT verify karta hai. Missing token 401. Invalid/expired token 400. Valid payload `req.user` ban jaata hai.
5. `upload.single('file')` multipart parse karta hai. CloudinaryStorage original stream Cloudinary upload stream ko pipe karta hai. Server data ke path mein hai; browser-to-cloud direct upload nahi. App local disk write configure nahi karti.
6. Upload folder `uploads`. Public ID 12 random bytes hex + original filename. Configured formats jpg/jpeg/png/pdf/doc/docx. Size cap 10 × 1024 × 1024 bytes. Cloudinary format option full MIME/magic-byte validation nahi.
7. Storage-engine callback `secure_url → req.file.path`, `public_id → req.file.filename`, `bytes → req.file.size` map karta hai. Original filename/mimetype multipart metadata se aate hain.
8. Route File document save karti hai: owner ID, URL, PublicId, size, filename, mimetype. `uploadDate` default Date.now hai. File bytes `content` field mein save nahi hoti.
9. File save ke **baad** backend `${FRONTEND_URL}/print/${newFile._id}` ka QR PNG banata hai. Error-correction H, margin 1. QR image folder `qrcodes` mein upload hoti hai. QRModel mein fileId, QR image URL, print URL, createdAt save hote hain.
10. Upload response `{success,message,fileId,fileUrl}` deti hai. QR image URL response mein nahi. Dashboard `setFile(fileId)` karta hai aur `/generate-qr` kholta hai.
11. Owner “Generate QR Code” click karta hai. GET qrcode endpoint owner check karke already stored QR deti hai. Image, filename/date show hote hain. Isi success ke baad browser `timeLeft=20` aur `timerActive=true` set karta hai.
12. Scanner QR padhta hai. Encoded frontend `/print/:fileId` page khulta hai. Kawach app mein camera scanner implementation nahi mila. Us browser mein JWT chahiye; owner ka token QR mein nahi aata. Fresh print-shop browser ki API request 401 fail hogi.
13. Valid JWT ho toh print API File ID se query karti hai. **Owner ya QR permission verify nahi hoti.** Existing file ka URL, filename, mimetype response mein milta hai.
14. Print button blank popup kholta hai. HTML mein `<img src="Cloudinary URL">` inject hota hai. Image load par browser print dialog aata hai. afterprint/timeout window close aur dashboard redirect try karte hain. Paper print success verify nahi hota. API consume/delete call nahi hoti.
15. Owner ka QR page open aur timer active rahe toh roughly 20 ticks par DELETE attempt hota hai. Auth + ownership check ke baad original cloud file destroy try; QR Mongo record delete; File Mongo record delete. QR cloud image remain karti hai. Helper failure ignored ho sakti hai.
16. File record gone ho toh future print API 404. Direct cloud URL ka result actual delete/cache settings par depend karega. Saved screenshot/download/print-spool copy ko Kawach erase nahi kar sakta.

```mermaid
sequenceDiagram
    participant U as Owner browser
    participant A as Express API
    participant C as Cloudinary
    participant M as MongoDB
    participant P as Scanner browser
    U->>A: Login
    A->>M: User lookup + bcrypt compare
    A-->>U: Signed JWT (2h)
    U->>A: Multipart file + Bearer JWT
    A->>C: File stream upload
    C-->>A: secure_url, public_id, bytes
    A->>M: Save File
    A->>C: Upload print-URL QR PNG
    A->>M: Save QR record
    A-->>U: fileId + direct fileUrl
    U->>A: Owner GET QR
    A-->>U: QR image URL
    Note over U: Browser countdown starts at 20
    P->>A: GET print/:fileId + its own JWT
    Note over A: JWT checked; owner/expiry/use not checked
    A-->>P: Direct Cloudinary URL
    P->>C: Image fetch for browser printing
    U->>A: Timer-triggered DELETE (conditional attempt)
    A->>C: Try original asset destroy
    A->>M: Delete QR + File records
```
**Feature boundary:** Pick/drop first file immediately upload karta hai; camera QR scan app code absent.
Forgot password, history, remember-me behavior aur server logout workflows implemented nahi.
Print sirf image-popup flow hai; actual paper success ya recipient copy erasure claim mat karo.
Is journey ko main reference rakho; remaining sections specific checks/failures explain karte hain.

### Beginner feature map

Har row: simple What/Why → actual How → real limitation. Q ko aloud answer karo; detail existing sections mein hai.

| Feature / interview prompt | Sabse Easy Meaning / Why | Kawach Mein Kaise Kaam Karta Hai | Important Limitation |
|---|---|---|---|
| **Signup** · Q: Account kaise banta? | Account banana; new user entry | Form → register → hash → users save | Auto-login nahi; full hash response |
| **Login** · Q: Login kaise verify hota? | User identify karna; protected access start | Email/password → compare → JWT → localStorage | No refresh/revocation |
| **Logout** · Q: Logout kya remove karta? | This browser se session exit | Context user clear; token remove | Server token cancel nahi karta; fileId remains |
| **Authentication** · Q: Authentication kya hai? | Tum kaun ho; identity check | JWT verify → req.user | No user existence recheck |
| **Authorization** · Q: Authorization kahan hai? | Tum kya access kar sakte ho; file privacy | QR/delete owner query | Print permission check absent |
| **ProtectedRoute** · Q: UI guard enough hai? | UI gate; logged-out page redirect | Context user null → login | Backend permission enforce nahi |
| **Dashboard** · Q: Dashboard kya karta? | Upload screen; file choose/drop entry | First file → automatic upload | No progress/lock; stale failed selection |
| **File upload** · Q: Upload kab successful? | File bhejna; print/share asset store | Auth → Multer/cloud → File → QR | No rollback/content scan |
| **Multipart/FormData** · Q: FormData kyun? | File request package; binary send | append(file,file) → multipart parts | JSON parser file nahi parse karta |
| **Multer** · Q: Multer ka role? | Multipart parser; file stream handle | single(file), size limit | No app MIME sniff/scan |
| **Cloudinary storage** · Q: Cloudinary kya store karta? | Remote asset warehouse; disk persistence avoid | Original and QR PNG cloud upload | Private delivery not configured |
| **MongoDB metadata** · Q: Metadata bytes se kaise alag? | File ki entry; owner/URL find karna | users/File/QRCode models | Cloud operations same DB transaction mein nahi |
| **QR generation** · Q: QR ka payload kya? | URL ki picture; type na karna pade | Backend print URL → PNG → cloud/QR record | No secret/consume state |
| **QR fetch/display** · Q: Button generate ya fetch? | Owner ko stored QR dikhana | Owner GET → image/details show | Loading/error not rendered; refresh loses ID |
| **QR scanning/access** · Q: Fresh browser scan kare? | Print URL open; recipient navigation | External scanner → print/fileId | Scanner needs own JWT; no camera app code |
| **Print page** · Q: Print page public hai? | Document details; print button UI | Param + JWT → print metadata API | Owner/share check missing |
| **Browser printing** · Q: Print complete ka proof? | Image ka print dialog; paper output request | Popup img load → window.print | PDF/DOC renderer absent; success unverified |
| **Countdown timer** · Q: 20 ya 60 seconds? | Screen ghadi; cleanup attempt schedule | QR GET success → 20 ticks | No server deadline; close/tab delay affects |
| **Automatic deletion request** · Q: Tab close toh cleanup? | UI cleanup trigger; retention reduce karne ka attempt | Active timer zero → owner DELETE | Browser-dependent; no durable retry |
| **Cloud deletion** · Q: 200 means asset gone? | Original cloud asset hatana; storage cleanup | PublicId image/raw destroy attempts | False result ignored; QR PNG remains |
| **MongoDB deletion** · Q: Records delete se cloud gone? | Stored entries hatana; old File lookup stop | QR record then File record remove | Cloud fail par retry ID lose sakte |
| **Error/toast handling** · Q: Failure user ko kaise dikhta? | User ko result/failure batana | Page catches → toast/state | Hosts inconsistent; QR error state hidden |
| **React Context** · Q: Redux kyun zaroori nahi? | Shared values; prop passing reduce | Provider user/fileId + actions | Refresh restore absent |
| **Axios API calls** · Q: fetch kyun valid alternative? | UI se backend baat; shared request defaults | baseURL + page calls + explicit JWT | No timeout/interceptor/refresh |

<a id="section-5"></a>

## 5. Important APIs

Base mounts [server.js](server/server.js) mein hain.
Missing token 401; invalid/expired 400 shared middleware behavior hai.

| Method | Route | Auth | Purpose | Important backend behavior | Important limitation |
|---|---|---|---|---|---|
| GET | `/` | Public | Welcome message | No DB readiness probe | Healthy DB/provider state prove nahi |
| POST | `/api/v1/auth/register` | Public | Account create | Presence/email check, hash, user save | Full hash response; validation/race gaps |
| POST | `/api/v1/auth/login` | Public | JWT login | Email query, compare, sign 2h | Enumeration/no throttling |
| GET | `/api/v1/auth/test` | JWT | Token test | req.user log; plain text | No user existence/role recheck |
| POST | `/api/v1/file/upload` | JWT | Original + QR create | Auth then Multer; File save; QR upload/save | No rollback; middleware errors outside handler catch |
| GET | `/api/v1/file/qrcode/:fileId` | JWT + owner | Stored QR fetch | File {_id,user}, QR by fileId | No time check; no regeneration |
| DELETE | `/api/v1/file/delete/:fileId` | JWT + owner | Cleanup attempt | Cloud helper then QR/File Mongo deletion | False success/no QR cloud delete |
| GET | `/api/v1/print/:fileId` | JWT only | Print metadata | File.findById; url/name/MIME | No owner/share/expiry/consume check |
### Register

**Input:** JSON name,email,password,phone. address read hota hai but saved nahi.

**Response/errors:** 201 success,user; missing required values200 message; existing email200 success:false; catch 500 error.

**Interview-relevant detail:** Duplicate findOne precheck atomic nahi. DB index final guard; controlled duplicate-key response needed.

### Login

**Input:** JSON email,password; no OTP/QR login.

**Response/errors:** 200 success,user,token; missing/email absent/wrong password 404; catch 500 with error.

**Interview-relevant detail:** Distinct messages account discovery risk. Token handling ka canonical explanation section 7.

### Upload

**Input:** multipart/form-data field file; JWT in Authorization, not file body.

**Response/errors:** 200 success,message,fileId,fileUrl; no file 400; handler failures 500 message. QR URL not returned here.

**Interview-relevant detail:** Original cloud upload happens before File save. Later DB/QR fail partial assets chhod sakti hain; section 12.

### QR fetch

**Input:** fileId route param; owner-scoped File lookup, then QR lookup.

**Response/errors:** 200 success,qrCode,fileName,uploadDate; missing/not owner/missing QR 404; cast/DB error 500.

**Interview-relevant detail:** Stored PNG URL returned. UI button name generate hai, but request is read-only.

### Delete

**Input:** fileId + owner JWT; order/confirmation details section 8.

**Response/errors:** 200 success message after DB deletes; File absent/not owner 404; outer failures 500.

**Interview-relevant detail:** Repeated completed delete 404. Cloud helper success:false route ignore kar sakti hai.

### Print

**Input:** fileId + that browser own JWT. No QR token parameter.

**Response/errors:** 200 success,file:{url,filename,mimetype}; File absent 404; malformed ID/DB error 500.

**Interview-relevant detail:** Response gives URL, not file bytes. Known ID with wrong valid account also passes current query.

### Error handling boundaries

JSON parser and Multer middleware route-handler try/catch se pehle execute hote hain.
No centralized custom error middleware found; uniform JSON errors assume mat karo.
Malformed File ID validation absent; Mongoose cast errors often500 banti hain.
API500 response ka matlab process crash necessarily nahi.

**Absent endpoints:** list/history, profile/me, reset password, refresh, logout, share redemption, document update.
Routes GET/POST/DELETE use karti hain; action-style names hain. “Perfect REST” overclaim mat karo.
api/v1 namespace present hai; actual v2 migration/backward-compatibility evidence absent.

<a id="section-6"></a>

## 6. Database

File bytes Cloudinary mein hain. MongoDB account aur metadata rakhta hai. Mongoose schema validation app-side hai; foreign-key enforcement automatically nahi milta.

### User schema — model name `users`

| Field | Type | Rules |
|---|---|---|
| name | String | required; trim true |
| email | String | required; unique true; no lowercase/trim/format rule |
| password | String | required; controller bcrypt hash save karta hai |
| phone | String | required; no pattern rule |
| createdAt, updatedAt | Date | timestamps true |
| _id | ObjectId | default Mongoose identifier |

Registration create; login email read. Profile update/delete route absent. Address schema absent. `unique:true` index declaration hai, validator nahi. Deployed DB mein actual index bana hai ya nahi `[NOT VERIFIED FROM REPOSITORY]`.

### File schema — model name `File`

| Field | Type | Rules / actual use |
|---|---|---|
| filename | String | required; original filename |
| path | String | optional schema; upload route cloud secure URL set karti hai |
| content | Buffer | optional; current upload use nahi karti |
| mimetype | String | required; multipart declared MIME; content verification nahi |
| size | Number | required; cloud response bytes |
| uploadDate | Date | default Date.now; no expires rule |
| user | ObjectId | required; ref `User` |
| PublicId | String | required; exact capital P/I; cloud public_id |

Upload create. QR fetch/delete owner filter read. Print ID-only read. Delete removes record. No update route. No timestamps:true; uploadDate only. **[IDENTIFIED LIMITATION]** ref `User` actual registered `users` model se mismatch hai. Raw ID owner checks work kar sakte hain; `populate('user')` currently absent aur mismatch fix chahiye.

### QR schema — model name `QRCode`

| Field | Type | Rules / actual use |
|---|---|---|
| fileId | ObjectId | required; ref File |
| qrCode | String | required; QR PNG cloud response.url |
| fileUrl | String | required; frontend print URL, original asset URL nahi |
| createdAt | Date | default Date.now; no TTL/expiry |

Backend upload creates QR record. Owner GET reads it. Delete removes one matching record. No token, usedAt, expiresAt, downloadCount, recipient, unique fileId, QR public_id fields. Default collection naming expected users/files/qrcodes; live names `[NOT VERIFIED FROM REPOSITORY]`.

### Indexes, relationships aur concurrency

Current schema: email unique declaration. Default `_id` indexes expected. No explicit File.user, QR.fileId, TTL or compound indexes. Actual DB query plans/index inventory inspect nahi hua.

**[RECOMMENDED IMPROVEMENT]:** QR.fileId unique index agar business rule one QR per file hai. File.user index tab useful hoga jab owner list route add ho. ID+owner query pe `_id` lookup already one candidate tak narrow karta hai; compound index ko blindly optimization mat bolo. Future cleanup `expiresAt`/status lookup par matching index add karo.

Two deletes same file pre-read kar sakte hain. External cloud calls aur Mongo writes ek atomic operation nahi. Two print requests dono same URL receive kar sakti hain; state mutation hi nahi. Email pre-check ke baad duplicate save race ho sakti hai.
### Why MongoDB / why not PostgreSQL

Account aur document metadata records document shape mein naturally map hote hain.
Mongoose app-level shape/casting/validation deti hai; “no schema” claim wrong hai.
PostgreSQL valid alternative hai; stronger relational constraints/reporting useful ho sakte hain.
Current choice ko universally faster ya uniquely scalable mat bolo; workload measure needed.

**Concurrency point:** Email precheck+save atomic nahi; print reads no state update.
Future share access mein expiry aur unused status ek database operation mein check/update honge. Is single operation ko atomic update bolte hain.
Transaction Mongo writes group kar sakti hai, external Cloudinary operation ko include nahi.

**TTL boundary:** No TTL declaration in current schemas.
TTL asynchronous Mongo record cleanup hai, exact access deadline or cloud deletion nahi.
Pending cloud cleanup record TTL se erase hua toh retry identifier lose ho sakta hai.

<a id="section-7"></a>

## 7. Authentication + Authorization

### Easy difference

**Authentication:** “Tum kaun ho?”
**Authorization:** “Tum kya access kar sakte ho?”
Valid identity har file ka permission proof nahi.

### Password verification

Signup helper `bcrypt.hash(password,10)` hashed password save karta hai.
Login user ko email se find karta hai, then `bcrypt.compare` submitted password verify karta hai.
Cost factor 10 hai; ten literal rehashes nahi. Salted one-way hash hai, file encryption nahi.
Hash helper failure swallow kar sakta hai; recommended fix rethrow and handle safely.

### JWT creation

```js
JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' })
```

Application payload user `_id`; library `iat` and `exp` add karti hai.
Signed token tampering detect karta hai; readable payload encrypted secret message nahi.
Two-hour JWT lifetime **share-link deadline nahi**.
Traditional session mein server session ID ke against user state rakhta hai.
JWT identity verify karne ke liye separate session map needed nahi; file permissions DB mein phir bhi check karni hoti hain.

### Frontend storage and verification

Login context user set aur localStorage token save karta hai.
Protected requests `Authorization: Bearer <token>` bhejti hain.
Middleware second header item extract, `jwt.verify`, decoded payload req.user set, next call.

| Request | Current result |
|---|---|
| Missing token | 401 text Access denied |
| Invalid signature / expired JWT | 400 text Invalid token |
| Valid signed token | Handler continues; user existence query not repeated |

Issuer = token kis service ne issue kiya. Audience = token kis API ke liye hai.
Strict Bearer prefix and explicit issuer/audience/algorithms policy absent.
This alone demonstrated arbitrary-algorithm exploit prove nahi karta.

### Actual file authorization

QR fetch/delete: `File.findOne({_id:fileId,user:req.user._id})` owner check.
Print: `File.findById(fileId)` only.
**[IDENTIFIED LIMITATION]:** Other valid account with known File ID can receive stored URL.
Ye object-level authorization gap/IDOR risk hai; live exploit reproduction not performed.
ObjectId ko guess-resistant secret capability mat treat karo.

### Session limitations

| Limitation | Practical meaning | Recommended direction |
|---|---|---|
| localStorage JWT | Same-origin malicious script token read kar sakti hai | Prevent XSS; evaluate HttpOnly storage with CSRF policy |
| No server logout/revocation | Local removal stolen token invalidate nahi karti | Server access cancel policy (revocation) aur short token lifecycle |
| No refresh token | Expired token needs new login; handlers inconsistent | Planned refresh/relogin handling |
| No auth restoration | Refresh loses user/fileId despite remaining token | Server-verified restore or deliberate login UX |
| Enumeration + no rate limit | Email/wrong-password errors differ; unlimited attempts | Generic credential response + throttling |

Cookie migration all issues solve nahi karti; SameSite/CSRF and origin policy evaluate karo.
Current code auth cookie set nahi karti; classic ambient-cookie CSRF behavior claim unverified.

<a id="section-8"></a>

## 8. QR + Expiry + Deletion

### QR generation and payload

QR ek text ko scannable image banata hai; image encryption ya permission token nahi.
`fileRoutes` calls `generateQRCode(newFile._id, printURL)` **after File save**.
QRCode PNG buffer settings: error correction H, margin1. H damage tolerance hai, auth nahi.
`quality:0.92` option ko PNG/security guarantee mat bolo.

```text
Exact encoded text: ${process.env.FRONTEND_URL}/print/${newFile._id}
Example: http://localhost:5173/print/507f1f77bcf86cd799439011
```

Backend QR decode nahi karta; scanned frontend URL ka fileId print API ko jaata hai.
QRModel.qrCode = cloud QR image URL; QRModel.fileUrl = encoded frontend print URL.
Generated cloud asset names random hain; encoded share payload separate random secret nahi.
Fresh scanner browser mein owner JWT transfer nahi hota; own valid JWT required.
Print API QR record consult nahi karti; owner/share policy gap section 7.

### Timer and access boundary

File.uploadDate and QR.createdAt server Date.now defaults hain; expiresAt absent.
Server request par timestamp compare, consumed flag/update aur delete scheduler absent.
QR fetch success sets timeLeft 20, timerActive true. Every tick decrements local state.
Progress divides timeLeft by 60; initial progress roughly one-third, not full bar.

| Scenario | Current behavior |
|---|---|
| At 59 or 61 seconds | No 60-second server rule; successful File deletion gives 404, otherwise read can continue |
| Reuse or concurrent access | No atomic consumption; multiple reads may obtain URL |
| Read races delete | Query may return URL before record removal; returned bytes/URL not revoked |
| Refresh, back or close QR tab | Unmount clears timer; user/fileId reset on refresh; no independent cleanup |
| Background/suspended tab | Timer can run late; no trusted wall-clock deadline |
| Upload without QR fetch click | QR exists but countdown never starts |
| JWT/network failure at countdown | DELETE can fail; timerActive already false; no durable automatic retry |

### Exact deletion sequence

```text
Owner JWT + File {_id,user} check
  → deleteFileFromCloudinary(File.PublicId)
  → image destroy, then raw fallback if not ok
  → QRModel.findOneAndDelete({fileId})
  → FileModel.findByIdAndDelete(fileId)
  → success response
```

**[IDENTIFIED LIMITATION]:** Both cloud deletion attempts fail toh helper catches and resolves `{success:false}`.
Route result inspect nahi karti; await only completion wait karta hai.
Route success log/response false reassurance de sakti hai; metadata removal loses retry data.
QR Mongo record delete hota hai; QR image public_id stored nahi, cloud QR image orphan remain karti hai.
No transaction/durable retry; partial Mongo deletion also possible.
File record gone → print API 404. Direct cloud URL depends provider deletion/cache behavior; section 9.
Recipient downloaded bytes/screenshot/spool ko server erase nahi kar sakta.

### [RECOMMENDED IMPROVEMENT] Correct future separation

Access policy choose karo: deadline upload, activation ya first redemption se start hogi?
Server computes expiresAt and every redemption/read enforces permission + time.
Share token ka hash save karo. Ek DB update expiry aur unused status check karke token used mark kare. Concurrent callers mein sirf ek winner ho; ye atomic redemption hai.
Winner ko short delivery session do, jo sirf allowed file ke liye ho; ye scoped session hai. One-time redemption ke baad image/PDF ko multiple byte requests lag sakti hain.
Cloud cleanup durable worker job with pending/done/failed state; confirmed success tak metadata retain.
Delete repeat hone par safe result aana chahiye; ye idempotent retry hai. Pending job DB/queue mein save karo, process memory mein nahi. setTimeout restart ke baad lost hota hai.
Mongo TTL exact access gate or external-asset deletion ka substitute nahi.

### Top 8 QR/expiry interview questions

#### 1. QR exactly kya encode karta hai?

🎤 **Answer:** “FRONTEND_URL + /print/ + Mongo File ID. Original cloud URL/JWT/secret share token QR mein nahi.”

🔥 **Follow-up:** QR-based authentication?

🎤 **Follow-up Answer:** “Nahi. Login JWT identity establish karta hai; QR navigation text hai.”

#### 2. QR generate button backend generation hai?

🎤 **Answer:** “Backend upload ke during PNG banata hai. Frontend button existing QR fetch karta hai aur UI timer start karta hai.”

🔥 **Follow-up:** GET repeat?

🎤 **Follow-up Answer:** “Stored image same; successful fetch browser countdown 20 reset kar sakta hai.”

#### 3. QR one-time ya reusable?

🎤 **Answer:** “Current code consumes state nahi. Existing File and valid JWT ke saath repeated reads possible.”

🔥 **Follow-up:** Copied screenshot?

🎤 **Follow-up Answer:** “Same URL ki copy hai; copy-specific permission/revocation nahi.”

#### 4. 20 seconds vs60?

🎤 **Answer:** “Actual state 20 seconds hai. Comment/progress math 60 stale; server 60-second deadline absent.”

🔥 **Follow-up:** 59/61?

🎤 **Follow-up Answer:** “No backend time-specific difference; File presence and JWT determine result.”

#### 5. Refresh/tab close kya karega?

🎤 **Answer:** “QR interval unmount par clear hota hai, context reset hota hai. Independent server cleanup job nahi.”

🔥 **Follow-up:** Background tab?

🎤 **Follow-up Answer:** “Ticks throttle/delay ho sakte hain; exact wall-clock security deadline nahi.”

#### 6. Scan/print cleanup trigger?

🎤 **Answer:** “Nahi. Owner active QR page countdown DELETE try karti hai; print completion API call nahi.”

🔥 **Follow-up:** Cancel print?

🎤 **Follow-up Answer:** “afterprint/timeout close attempts physical success prove nahi.”

#### 7. Cleanup200 means all gone?

🎤 **Answer:** “Nahi. Cloud helper false result unchecked; Mongo records can disappear while original asset survives. QR cloud asset not removed.”

🔥 **Follow-up:** Retry?

🎤 **Follow-up Answer:** “No durable status/job; metadata removal can lose cloud retry identifier.”

#### 8. Proper one-time expiry design?

🎤 **Answer:** “Server deadline plus high-entropy token hash and atomic unused/unexpired redemption. Worker cloud cleanup separately confirm/retry kare.”

🔥 **Follow-up:** JWT enough?

🎤 **Follow-up Answer:** “Same JWT expiry tak dobara verify ho sakta hai. Share used hua ya nahi, ye separate DB state batayegi.”

<a id="section-9"></a>

## 9. Cloudinary + Multer + Storage

**Easy meaning:** Multer parcel kholta hai. Storage engine parcel cloud warehouse mein bhejta hai. MongoDB warehouse address aur owner ki entry rakhta hai.

**Original document:** Browser FormData → Express auth → Multer → `CloudinaryStorage._handleFile` → `file.stream.pipe(cloudinary.uploader.upload_stream(...))`. Params folder uploads, allowed_formats, public_id. `resource_type` aur `type:private/authenticated` explicit nahi. Local installed engine `path=secure_url`, `size=bytes`, `filename=public_id` maps. Repo lockfile pins engine 4.0.0; local installed implementation inspected.

**QR:** PNG Buffer → base64/data URI → `cloudinary.uploader.upload` with folder qrcodes and generated public_id. Controller stores `response.url`, not secure_url. QR response public_id/resource_type returned hote hain, par model save nahi karti.

**Asset names:** Original 12 random bytes hex + `_` + originalname. QR `qr_timestamp_` + 8 random bytes hex. Randomness collision chance reduce karti hai; user authorization/one-time token nahi banati.

**Resource type:** SDK backend upload default image hai; DOC/DOCX raw mapping configured nahi. PDF is often image resource type, but actual account delivery/upload permissions untested. Six allowed format strings hone ka matlab six formats tested/successful nahi. [Cloudinary upload documentation](https://cloudinary.com/documentation/upload_parameters).

**Public/private:** Source authenticated/private delivery configure nahi karti. Stored normal cloud URL direct expose hota hai. Live account policy, PDF/raw delivery restrictions aur actual public fetch behavior `[NOT VERIFIED FROM REPOSITORY]`. HTTPS URL transport ko AES/E2EE ya authorization guarantee mat bolo.

**Retrieval:** Print API Mongo File.path return karti hai. Browser cloud URL fetch karta hai. Backend file bytes proxy, short-lived URL generation aur authenticated download absent hain.

**Deletion metadata:** Original public_id required; image/raw result handling section 8 mein hai. Custom helper `invalidate:true` set nahi karti. Storage engine `_removeFile` uses invalidation, but ye separate Multer cleanup hook hai; later Mongo failure ka automatic rollback nahi.

**CDN caveat:** Cloud delete aur cached delivery copies separate hain. Provider docs destroy/delete par invalidation option specify karte hain. Current helper set nahi karti. Live cache persistence duration measure nahi ki; immediate URL failure guarantee nahi. [Cloudinary deletion documentation](https://cloudinary.com/documentation/delete_assets).
### Important choices and partial failure

Multer multipart parse karta hai; CloudinaryStorage actual cloud stream forward karti hai.
Current app disk persistence configure nahi karti, but server bytes ke trusted path mein hai.
No-server-disk ko no-server-access ya E2EE mat bolo.
Cloudinary convenient media API hai; private document storage alternative reasonable hai.

Original public-ID prefix 12 random bytes; QR suffix 8 bytes plus timestamp.
Originalname cloud ID mein use hai; safe filename generation recommended.
No local filesystem read route found; confirmed path-traversal exploit claim unsupported.

Original upload success + File save fail → cloud orphan.
File save success + QR upload fail → original asset and File remain.
QR cloud upload success + QR save fail → extra QR orphan possible.
No cross-system rollback in route; recovery plan section 12, not hidden auto-cleanup.

**Delivery boundary:** Cloud API upload authentication is different from download URL authorization.
Signed ordinary URL ka signature by itself arbitrary expiry enforce nahi karta.
Private delivery and provider-supported expiry-aware mechanism verify karna chahiye.
Returned URLs actual account restrictions ke under accessible hain ya nahi live test unverified.

<a id="section-10"></a>

## 10. Security

Current useful controls: bcrypt, JWT verification, QR/delete owner checks and 10 MiB upload cap.
Neeche source-level high-value gaps hain; live exploit or quantified impact claim nahi.
Fix column **[RECOMMENDED IMPROVEMENT]** hai; current implementation nahi.

| Issue | What | Impact | Current Code | Safe Interview Answer | Fix |
|---|---|---|---|---|---|
| Print IDOR | JWT only; findById owner/share filter absent | Known other-user ID reveals URL | printRoutes.js | Identity check hai, permission gap hai | Owner policy or explicit share capability on every read |
| No server expiry | Stored timestamps never compared | Browser close/delay can leave access open | GenerateQR.jsx; models; printRoutes | 20 UI ticks, no server 60-second gate | Server expiresAt predicate |
| No one-time redeem | No consumed state/atomic update | Reuse/concurrent reads allowed | printRoutes.js; qrModel | QR scan does not consume share | Ek check/update mein token used mark; file-only short session |
| Direct cloud URL | Stored URL exposed in upload/print responses | API bypass/reuse possible; live account behavior untested | fileRoutes; printRoutes; multer | URL delivery private policy absent | Private file delivery; server permission/time check; provider expiry verify |
| Cleanup false success | Helper resolves false; route ignores result | Cloud orphan, retry metadata lost | cloudinary.js; fileRoutes | 200 not deletion confirmation | Result check + durable retry state |
| QR cloud orphan | Only Mongo QR removed; no cloud QR ID saved | Storage growth and old QR image remains | qrcodeController; qrModel | QR record delete is not PNG delete | Track/delete both asset IDs and types |
| localStorage JWT | JS-readable Bearer token | XSS can steal token; server logout absent | AuthContext.jsx | Auth lifecycle security incomplete | XSS prevention; evaluate cookies/revocation |
| Password hash response | Full saved user returned on signup | Needless hash disclosure/offline guessing exposure | registerController | Hash stored but response should omit | Response mein sirf safe fields return karo (projection) |
| Broad CORS | origin:true reflection; credentials:true | All requesting origins allowed by browser policy | server.js | CORS is not authentication | Trusted origin allowlist |
| Weak input validation | Presence only; email query value not typed | Unexpected types/operators and bad records possible | authController; userModel | NoSQL login bypass not demonstrated | Strict types/lengths/normalization; reject operators |
| No rate limiting | Unlimited login/probe/upload work | Enumeration, bcrypt cost, storage abuse | server.js; authController | No 99% risk-reduction proof | Account/IP throttling, quotas, monitoring |
| File validation gaps | Size and cloud formats only | MIME spoof/malicious-content risks remain | multer.js | Formats configured, not verified safety | File bytes se type check; scan tak separate restricted storage (quarantine); correct cloud resource type |
| Sensitive logging | Full DB URI, file documents/URLs/errors logged | Credentials/private metadata leak into logs | db.js; fileRoutes; authController | Env secrets can leak via logging | Redact secrets; safe error IDs/log access |
| Browser anti-copy | preventDefault only; URL already delivered | Screenshots/save/other client possible | Print.jsx | Print UX, not copy prevention | Server authz/private window; honest copy boundary |

### Terms interviewer use karega

IDOR = object ID badal kar forbidden file access; permission check missing.
Rate limiting = repeated requests ki speed/count cap; current middleware absent.
Validation = allowed input type/shape/size check. Sanitization/escaping context-specific safe representation.
XSS = unwanted script same-origin context mein run hona. CSRF = browser credentials se unwanted request.

### Evidence boundaries

| Topic | Honest conclusion |
|---|---|
| XSS | JSX text escapes; Print document.write stored cloud URL interpolate karti hai; exploitable payload path not reproduced |
| CSRF | Explicit Bearer header; no app auth cookie set. Cookie migration needs SameSite/CSRF design |
| NoSQL injection | Raw email shape validation absent; bcrypt verification still required. Successful login bypass not proved |
| Path traversal | Originalname cloud naming mein; local disk file-read/write path absent. No demonstrated local traversal |
| AES/E2EE | No encryption/decryption/key/IV/tag lifecycle. Crypto random IDs are not encryption |
| Secrets in history | .env ignored, tracked code uses names/placeholders. Complete historical secret scan not performed |
| Database network policy | Frontend DB access absent; actual network allowlist (ACL) aur minimum-permission deployment config unverified |
| Error leakage | Local catches expose error/message; parser/Multer uniform safe JSON handling absent |

**Priority:** Print authorization + server expiry/private delivery first; durable cleanup next.
Then validation/rate limits/token lifecycle, safe logs, UI recovery and regression tests.
Enterprise-grade/zero-trust/guaranteed secure labels require evidence beyond current source.

<a id="section-11"></a>

## 11. Performance + Scalability

**No measured benchmark was found.** Frontend build pass runtime throughput, latency, security ya physical print success ka benchmark nahi. Home ke 99.99%/1M+/24/7 values static UI hain.

### Current performance ka reason

Upload response se pehle ye steps order mein complete hote hain: original cloud upload → Mongo File write → QR encoding → second cloud upload → QR write. Response se pehle dono cloud uploads complete hote hain. Cloud/DB network wait response slow kar sakta hai. Har stage ka measured time available nahi.

Original file stream server se cloud jaati hai, full original Buffer in app route absent. Streaming zero RAM nahi. Chhote data buffers aur simultaneous requests memory use karte hain. QR buffer aur base64 string extra allocation hain. Ek file cap 10 MiB hai. Sab simultaneous uploads ka combined cap absent.

Login bcrypt async work native worker resources use karta hai; unbounded login abuse expensive ho sakta hai. Async/await I/O wait mein JS event loop ko free rakhta hai; CPU work automatically parallel nahi hota. QR generation uses library Promise/encoding work; promise hona worker-thread guarantee nahi.

Print DB ID lookup ke baad bytes cloud se aati hain. QR.fileId query ke liye explicit index absent. No pagination/list endpoint, no app cache, no queue, no load balancer config. React screen animations aur blur rendering low-end device performance affect kar sakte hain; profiling required. No lazy route split configured.

### User count ke saath risk — predictions, measured capacity nahi

Registered users, active users aur simultaneous uploads different numbers hain. 100 accounts with one upload aur 100 concurrent 10 MiB uploads ka load same nahi. Kisi number par exactly break hone ka code proof nahi.

| Hypothetical scale | Pehle kya inspect/plan karna chahiye |
|---|---|
| 100 users | Permission, cleanup reliability, failed signup/refresh; per-user upload quotas |
| 1,000 users | Concurrent cloud uploads, bcrypt load, DB/cloud latency, connection limits |
| 10,000 users | Upload bandwidth; concurrent request cap (admission control); QR index; future history pagination; pending cleanup jobs |
| 100,000 users | Multiple API instances after stateless permission design; load balancing; workers; quotas and monitoring |
| 1M users | Workload/size distribution, cloud and DB cost/limits, regional delivery, partitions only if measurements require |

**[RECOMMENDED IMPROVEMENT] Future architecture:** Static frontend → load balancer → multiple API instances → shared MongoDB permission/expiry state. Private asset storage. Durable queue + cleanup workers. Redis could coordinate rate limits/cache non-sensitive metadata; currently not installed. Cache must respect permission/expiry; long-lived public-file caching security policy se conflict kar sakti hai.

Horizontal scaling = same backend ki multiple copies. Load balancer requests distribute karta hai. JWT verification per-process memory session demand nahi karti, but DB/share state remains necessary. Share consume ka check/update ek atomic DB operation ho. Worker repeat task safely handle kare; ye idempotent retry hai. Microservices/sharding compulsory first step nahi; single API architecture ko measure karke scale karo.

### How I would measure

Disposable staging uploads at realistic sizes/concurrency; stage timings for both cloud uploads and DB writes.
Request timings p50/p95/p99 record karo. Example: p95 ka time woh hai jisme 95% requests complete hue.
Requests/second throughput hai. Process RAM (RSS), error rate aur event-loop delay bhi measure karo.
DB query plan se check karo ki index use hua ya scan; provider limits bhi note karo.
Registered accounts ≠ active users ≠ concurrent uploads. No exact break threshold from source.
Ek request ID se har stage ka time/error jodo; ye observability mein help karta hai. Current console/Morgan full tracing/metrics system nahi.
Rate limits and per-user quotas aggregate cloud cost/bandwidth abuse reduce karne ke liye recommended.

**Worker meaning:** Browser-independent durable task processor; file cleanup retries after restart.
**Queue meaning:** Pending work ki persistent list. **Cache:** Repeated non-sensitive answer ki temporary copy.
Redis only future coordination/cache option; cache stale permission/expiry allow na kare.
Cron periodic trigger hai, exact access-denial timer nahi. Current worker/queue/cron implementation absent.

<a id="section-12"></a>

## 12. Failure + Debugging

Source-traced scenarios hain; live provider outage injection nahi kiya.
Fix column future design hai. Full journey repeat nahi; failure stage isolate karo.

| Failure | What Happens Now | How I Debug | How I Would Fix |
|---|---|---|---|
| MongoDB down | connectDb catches/logs; listen still starts. Requests can wait/fail through Mongoose, no readiness gate. | Redacted connect error, connection state, timeout, network/DNS. | Await DB before listen; readiness; bounded query timeout. |
| Cloudinary original upload down | Storage middleware fails before route try/catch; UI generic upload error; uniform JSON not ensured. | Multer error + cloud response, request ID; never API secret. | Central error handler, retry policy and bounded provider timeout. |
| Invalid file/type | allowed_formats sent to cloud; no custom MIME/content validation. Rejection behavior depends format/account. | Multipart field, declared MIME, magic bytes, cloud error. | Allowed type aur file bytes check karo. Scan tak file separate restricted storage mein rakho (quarantine). |
| Huge file | Multer limit 10 MiB. Error arrives before handler catch. Engine cleanup may run; live outcome untested. | LIMIT_FILE_SIZE, exact bytes, no payload logging. | Map to 413; add client precheck and concurrency quota. |
| Malformed JSON / missing file / ID | Parser error before route; missing file explicit 400; malformed ObjectId can produce 500 in route. | Content-Type, JSON syntax, file field, ID format. | Central safe JSON errors and input validation. |
| JWT invalid | Middleware 400 Invalid token. Frontend handlers inconsistent. | Header format, secret setup, library verify error safely. | Standard 401; strict Bearer parse; central client auth handling. |
| JWT expired | Same 400; no refresh-token flow. QR cleanup can fail. | Token expiry/iat and server clock; token value log nahi. | Clear client state; planned token lifecycle; server cleanup independent. |
| QR expired / reused | No backend QR expiry or consumed state. Existing File + JWT allows print read. | File existence, owner page timer, DELETE response. | Server expiry check; token ek DB operation mein unused se used mark karo. |
| File record deleted | Print lookup 404; old delivered cloud URL independent. | File ID in safe DB tooling; asset delete confirmation. | Generic expired/unavailable UX; private delivery. |
| Cloud upload success, File save fails | Cloud original orphan. Handler sends 500; no compensation. | Cloud ID correlation + Mongo write error. | Upload stage DB mein save karo. DB save fail ho toh cloud asset delete retry karo (compensation). Cloud/DB entries compare karke leftovers find karo (reconciliation). |
| File save success, QR cloud upload fails | Original + File remain; upload response 500; no QR record. | File save status then QR upload error. | Compensate or explicit pending/failed QR status with retry. |
| QR cloud upload succeeds, QR Mongo save fails | Original + File + QR cloud image can remain; no QR record. | QR asset ID in redacted trace; DB write error. | Store/track both asset IDs for retry cleanup. |
| Cleanup cloud fails | Helper returns success:false; route may remove metadata and report success. | Inspect helper result, cloud asset using known PublicId, avoid relying on success log. | Keep pending deletion metadata; check result; retry worker. |
| QR/ File Mongo delete fails partway | No transaction; original may gone; metadata may partially remain; 500 outer catch. | Check all three resources independently. | Cleanup status save karo; repeated delete safe ho. Related Mongo deletes transaction mein group kar sakte hain; cloud delete separate rahegi. |
| Concurrent access/delete | Print may return URL before delete; no consume state/locking. | Correlated request timings and DB results. | Atomic redeem; deny expired reads; delivery policy. |
| Network timeout / retry duplicate upload | Axios has no explicit timeout; response loss can happen after successful writes. Retry creates new assets/records. | Request stage/status with request ID; browser Network tab. | Client timeout/cancel plus idempotency key; cancellation is not remote rollback. |
| Server restart / browser close | No durable cleanup schedule. Closing QR page stops countdown; restart does not reconstruct expiry tasks. | DB File/QR and cloud inventory; process restart logs. | Server deadline check kare. Saved jobs worker retry kare; cloud/DB entries compare karke leftovers find kare. |
| Fresh scanner has no JWT | Public frontend Print page loads; backend 401; toast/redirect dashboard then guard login. | Token presence and print API auth status in that browser. | Explicit share capability separate from owner login. |
| Signup success but dashboard not shown | Signup does not call login; context null; protected route sends login. | Register 201; AuthContext user; navigation. | Navigate login intentionally or explicit signup token/session flow. |
| PDF/DOC print blank | Popup only img; MIME ignored; onload may never trigger. | Cloud delivery response and MIME, popup image load. | Type-specific PDF view/print or controlled conversion; no fake support claim. |
| 401 on QR fetch | Catch calls undefined logout; ReferenceError; state errors not rendered. | Lint no-undef and actual stack. | Destructure logout; unify auth statuses and render error/loading. |
| Popup blocked | handlePrint shows allow-popups toast and navigates dashboard. | window.open return null; browser setting. | Keep recovery UI; user gesture popup and content-ready flow. |

**Common debugging order:** Browser Network status/body → request correlation → auth decision → DB record → cloud asset.
Secret/token/document payload log mat karo. Cloud confirmation aur DB state independently inspect karo.
Client timeout/cancel remote completed write rollback nahi karta; retry se duplicate upload possible.
Asset ID ke bina cloud/DB entries match karna difficult hai; ise reconciliation bolte hain. Successful cloud deletion tak ID preserve karo.

<a id="section-13"></a>

## 13. Resume Defense

Resume source found: `C:/Users/Prince/OneDrive/Desktop/resume code.txt` (LaTeX source). Desktop ke `resume.pdf` aur `Resume (2).pdf` byte content extract/compare nahi kiye; kaunsi version actual submitted hai `[NOT VERIFIED FROM REPOSITORY]`. Neeche exact text LaTeX formatting remove karke diya hai. Other projects ke metrics/stack ko Kawach mein import mat karo.

### Exact stack label

“Kawach: Secure Document Sharing | React.js, Node.js, Express.js, MongoDB, JWT, AES”

React/Node/Express/Mongo/JWT code mein used. **AES [RESUME CLAIM — VERIFY BEFORE INTERVIEW]**: encryption/decryption pipeline absent. Safe stack: “React, Vite, Tailwind, Node, Express, MongoDB/Mongoose, JWT, bcrypt, Cloudinary, Multer, QRCode”.

### Bullet 1 — [RESUME CLAIM — VERIFY BEFORE INTERVIEW]

> Built a secure full-stack MERN web application featuring QR-based authentication and AES-encrypted links with a 60-second expiry to prevent unauthorized data interception.

**Meaning / evidence:** MERN verified. QR is print URL transport, authentication JWT login hai. Crypto random bytes IDs banate hain; AES-encrypted links absent. Timer 20 browser seconds; server 60 expiry absent. “Prevent interception” guarantee source prove nahi.

**Implementation:** `main.jsx`, React pages; `server.js`; models; authController; qrcodeController; GenerateQR. Personal “Built” attribution poora code prove nahi.

🎤 **Interview Answer:** “MERN upload aur QR sharing flow present hai. Is checkout mein QR authentication, AES links aur 60-second server expiry ka evidence nahi, isliye main unhe implemented feature nahi bolunga.”

**Safe wording:** “Contributed to a MERN document-sharing prototype with JWT login, Cloudinary uploads and QR links to a browser print page.” Contribution scope Git/self evidence ke hisaab se use karo.

**Evidence:** [QR controller](server/controllers/qrcodeController.js), [timer](client/src/pages/GenerateQR.jsx), [JWT login](server/controllers/authController.js).

**Unsafe:** “AES-encrypted one-time login QR blocks all interception for exactly 60 seconds.”

### Bullet 2 — [RESUME CLAIM — VERIFY BEFORE INTERVIEW]

> Implemented an automated self-destruct mechanism via RESTful APIs to purge files from cloud storage and MongoDB post-access, achieving a zero data retention footprint.

**Meaning / evidence:** Owner-authorized DELETE route exists. Browser timer calls it, access/print completion nahi. Original cloud destroy attempted; helper failure ignored. Mongo QR/File removal; cloud QR asset removal absent. Cached/downloaded/spooled copies outside control. Zero retention unsupported.

🎤 **Interview Answer:** “Cleanup API original cloud asset delete try karti hai aur Mongo file/QR records remove karti hai. Trigger browser countdown hai; post-access self-destruct aur zero retention guarantee present nahi.”

**Safe wording:** “The prototype includes owner-checked cleanup APIs and a 20-second browser countdown that requests deletion.” Personal ownership automatically imply mat karo.

**Evidence:** [Delete route](server/routes/fileRoutes.js), [cloud helper](server/utils/cloudinary.js), [QR schema](server/models/qrModel.js).

**Unsafe:** “Every copy permanently destroyed immediately after printing with no trace.”

### Bullet 3 — [RESUME CLAIM — VERIFY BEFORE INTERVIEW]

> Hardened single-use access with stateless JWT authentication and secure session management, evaluating 5+ document formats and mitigating data misuse risks by 99%.

**Meaning / evidence:** JWT signed token, 2h, localStorage verified. Single-use flag/atomic consumption absent. Secure session lifecycle overstated: no restore/refresh/revocation. Six configured format names verified, evaluation/test results absent. 99% methodology/data absent.

🎤 **Interview Answer:** “JWT authentication aur six allowed-format strings configured hain. Single-use enforcement, format evaluation results aur 99% risk reduction is repository se verify nahi hote.”

**Safe wording:** “JWT protects backend APIs; upload configuration sets a 10 MiB limit and jpg/jpeg/png/pdf/doc/docx format options.” Tested-format claim independently prove karo.

**Evidence:** [Auth context](client/src/context/AuthContext.jsx), [upload config](server/middlewares/multer.js), [print route](server/routes/printRoutes.js). No checked-in evaluation data.

**Unsafe:** “JWT automatically makes every QR single-use and reduces misuse 99%.”

### Personal contribution — Git evidence

README contributors: Sujal Raj, Prince Seth, Harsh Kumar. README list authorship ka complete proof nahi. Available history includes earlier Sujal/Sujal Raj commits, recreated-repository message, and Prince-authored later commits. Missing earlier history ki work allocation infer nahi kar sakte.

| Commit | Author/date | Actual diff evidence |
|---|---|---|
| d285e86 | Prince Seth, 7 June 2026 | CORS credentials false → true; db.js dns.setServers add; PROJECT.md add |
| 30115d6 | Prince Seth, 7 June 2026 | PROJECT.md documentation change |
| 78e96c0 | Prince Seth, 13 August 2026 | Existing interview guide commit |
| 44eda36 / fd7fc3a | Prince Seth, 29 April 2026 | README repository URL/contact edits |
| 83f8e53 / 163ab03 | Sujal Raj, 31 March 2025 | QR/dashboard-related history; titles alone full authorship breakdown nahi |

🎤 **Q: What did YOU build?**

**Interview Answer:** “Available Git history mein mere CORS credentials aur DNS configuration changes, plus project documentation work visible hain. Poore frontend/backend ko mera sole work bolne ka evidence nahi.”

**Q: CORS bug ka exact fix?**

🎤 **Interview Answer:** “Prince-authored d285e86 mein credentials false se true hue aur DNS servers add hue. Diff verified hai; browser issue solve hua tha ka regression evidence nahi mila.”

### Resume keyword boundary

Kawach-relevant JS, HTML/CSS, React, Node, Express, MongoDB, REST, Git, auth aur system-design reasoning guide mein covered. AES unsupported resume keyword hai. TypeScript implementation absent; @types packages JavaScript ko TypeScript app nahi banate. Next.js, FastAPI, LangChain/LangGraph/LangSmith, vector DB, Neo4j, AWS/S3/EC2, Docker, Nginx, CI/CD, Prisma/Supabase/PostgreSQL, Redux Toolkit, Storybook, AI/RAG, Redis current Kawach implementations nahi. Redis/queues/private storage sirf explicitly labeled future options hain. Other-project claims Kawach repository se verify nahi kiye ja sakte.

Resume contains a Vercel live link. Actual deployment behavior, host config, uptime aur backend provider `[NOT VERIFIED FROM REPOSITORY]`; URL ko deployment proof mat banao.

<a id="section-14"></a>

## 14. Configuration + Deployment + Testing

### Important environment

| Variable | Source use / interview point |
|---|---|
| PORT | server listener env or 8080 |
| MONGO_URL | mongoose URI; logged full value currently |
| JWT_SECRET | Login sign and middleware verify; no startup validation |
| CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET | Server-only cloud config; never client VITE vars |
| FRONTEND_URL | Encoded print link base; missing/malformed gives broken QR target |
| VITE_BACKEND_API | Axios baseURL; browser-visible build-time config; no Vite API proxy |
| DEV_MODE | Logged only; not production behavior switch |
| CLOUDINARY_URL | README mentions; explicit application read absent; SDK auto-env behavior untested |

.env ignored; actual values not read for this guide. Ignoring secrets is not proof of zero historical leaks.
VITE-prefixed values bundle mein visible; Mongo URI/cloud secret must stay server-side.
dotenv default current working directory matters; start processes from respective folders.

### Startup / dependencies

| Area | Verified fact / limitation |
|---|---|
| Backend start | server folder npm start → node server.js |
| Client start/build | client folder npm run dev / npm run build; static Vite output |
| Combined script | Calls concurrently but dependency concurrent; server ./client sibling path wrong; intended client dev command missing |
| nodemon | Script uses it; declared dependency absent |
| Frontend versions relevant to draft | React 18.3.1; Router lock7.0.1, not6; Vite 6.0.1 |
| Runtime | Audit used Node 20.20.2; Router 7 >=20; README Node14+ insufficient |
| Storage peer conflict | Engine 4.0.0 cloudinary peer^1.21.0; project Cloudinary 2.5.1; clean install can conflict |
| Build/style config | React Vite plugin; Tailwind content scan; PostCSS/Autoprefixer; no configured API proxy |
| Unused capabilities | jsqr/qrcode.react inactive; EJS no render; crypto/path npm packages not AES; types packages not TS implementation |

Blind force/legacy install ko proved compatibility fix mat bolo.
Vite 6 version-specific support: [official note](https://v6.vite.dev/blog/announcing-vite6).

### Deployment / testing evidence

| Topic | Evidence boundary |
|---|---|
| Hosted frontend | Resume Vercel link exists; actual live setup/runtime not verified |
| Backend/DB host | Deployment provider, Atlas configuration, ACLs, uptime not verified |
| Docker / CI/CD | No tracked Dockerfile/Compose/workflows/deploy infrastructure found |
| SPA deep links | Host needs index fallback for print/:id; rewrite config absent from source |
| Frontend build | Earlier audit PASS; outdated Browserslist warning; not throughput/security proof |
| Frontend lint | Earlier audit FAIL: 26 errors / 2 warnings, including undefined logout and hook issues |
| Backend syntax | Earlier audit node --check all tracked backend JS PASS |
| Automated tests | No tracked test suite/scripts found |
| Integration / printing | Mongo/Cloudinary live deletion, exploit, physical print, deployment not run |
| Historical manual tests | No checked-in Postman/format evaluation evidence; do not invent |

**[RECOMMENDED IMPROVEMENT] Verification plan:** Two disposable accounts; owner/other/missing/expired JWT tests.
Inject cloud/Mongo failures at each stage; assert metadata preserved for retries and both cloud assets cleanup.
Future parallel redemption one winner; deadline check with page closed and 59/61-second requests.
Test image/PDF/DOC rendering individually. Test server restart/pending cleanup and response-loss retry.
Production needs trusted origins, safe logs/secrets, DB readiness, monitoring and CI regression checks.

<a id="section-15"></a>

## 15. Top Interview Questions

60 selected questions. Core section explanations repeat nahi; answers speaking practice hain.
QR/expiry ke eight canonical questions section 8 mein hain, yahan duplicated bank nahi.
Source notes question ki simple explanation mein compactly include hain.

### Level 1 — Beginner: 10

#### Q: Kawach kya hai?

**🎤 Short Interview Answer:** “MERN document upload aur QR sharing prototype hai. JWT login, Cloudinary storage aur browser printing flow use karta hai.”

**🧠 Easy Explanation:** Owner file ki entry banata hai aur scanner print page kholta hai. Source: Dashboard → fileRoutes → qrcodeController → Print.

**🔥 Follow-up:** Fully secure hai?

**🎤 Follow-up Answer:** “Nahi bolunga. Print permission, server expiry aur cleanup guarantees mein gaps hain.”

#### Q: Kaunsi problem target hai?

**🎤 Short Interview Answer:** “Print shop ko document dene ke baad uncontrolled copies ka privacy risk target karta hai. Cloud sharing aur cleanup flow demonstrate karta hai.”

**🧠 Easy Explanation:** File unnecessary time tak rakhna privacy risk ho sakta hai; copy prevention absolute nahi. Source: README problem; GenerateQR cleanup trigger.

**🔥 Follow-up:** Zero retention?

**🎤 Follow-up Answer:** “Current code cloud QR aur downloaded copies clear nahi karti; zero retention unsupported hai.”

#### Q: MERN ke four parts kahan hain?

**🎤 Short Interview Answer:** “React UI, Express routes, Node runtime aur MongoDB metadata database hain. Mongoose database models define karta hai.”

**🧠 Easy Explanation:** Har part ka kaam alag hai. Source: client/src; server/server.js; server/models.

**🔥 Follow-up:** Cloudinary database hai?

**🎤 Follow-up Answer:** “File assets cloud mein hain; Mongo metadata database hai. Dono same role nahi.”

#### Q: File aur metadata mein difference?

**🎤 Short Interview Answer:** “File bytes Cloudinary store karta hai. Mongo filename, owner, URL, size aur PublicId store karta hai.”

**🧠 Easy Explanation:** Parcel aur uski receipt alag hain. Source: fileModel content optional unused; upload sets path.

**🔥 Follow-up:** Mongo Buffer use kiya?

**🎤 Follow-up Answer:** “Schema field present hai, current route usko populate nahi karti.”

#### Q: Signup auto-login karta hai?

**🎤 Short Interview Answer:** “Nahi. Register account banata hai, token nahi. UI dashboard navigate karti hai, fresh user guard login bhejta hai.”

**🧠 Easy Explanation:** Account banna aur session milna alag kaam hain. Source: SignUp handleSubmit; ProtectedRoute.

**🔥 Follow-up:** Fix?

**🎤 Follow-up Answer:** “Login par navigate karo ya explicit signup-auth contract add karo.”

#### Q: Login password kaise check hota?

**🎤 Short Interview Answer:** “Email se user lookup aur bcrypt.compare hota hai. Match par backend two-hour JWT sign karta hai.”

**🧠 Easy Explanation:** Stored hash se submitted password verify hota hai. Source: loginController; comparePassword.

**🔥 Follow-up:** Hash decrypt hota?

**🎤 Follow-up Answer:** “Nahi. bcrypt one-way password hashing hai; compare verify karta hai.”

#### Q: Logout API kahan?

**🎤 Short Interview Answer:** “Logout API nahi hai. Context user clear aur localStorage token remove hota hai.”

**🧠 Easy Explanation:** Apna browser credential hata raha hai. Source: AuthContext.logout.

**🔥 Follow-up:** Stolen token revoke?

**🎤 Follow-up Answer:** “Nahi. Server revocation absent; stolen token expiry tak verify ho sakta hai.”

#### Q: CSS tools ka actual responsibility?

**🎤 Short Interview Answer:** “Tailwind utility classes UI style karti hain; PostCSS/Autoprefixer CSS build process mein hain.”

**🧠 Easy Explanation:** Styling aur backend security different jobs hain. Source: client style/build config.

**🔥 Follow-up:** App.css active?

**🎤 Follow-up Answer:** “Sample App.css active entry mein imported nahi; irrelevant sample styling ko feature mat bolo.”

#### Q: Toast error consistently visible hai?

**🎤 Short Interview Answer:** “Only GenerateQR par hot-toast Toaster mila. Signup toastify container absent; notification flow inconsistent hai.”

**🧠 Easy Explanation:** toast call aur notification host render hona alag. Source: main.jsx/pages.

**🔥 Follow-up:** Fix?

**🎤 Follow-up Answer:** “One global notification host and one library; page error/loading text also render karo.”

#### Q: Why Node.js and React same language stack?

**🎤 Short Interview Answer:** “UI and API JavaScript use karte hain; ecosystem integration simple hai. Original personal choice proof unverified.”

**🧠 Easy Explanation:** Same language means less context switching; automatically more secure/fast nahi. Source: React client; ES module server.

**🔥 Follow-up:** Other language worse?

**🎤 Follow-up Answer:** “Nahi. Requirements, team skill and workload decide; preference fabricate nahi.”

### Level 2 — Intermediate: 15

#### Q: Authentication aur authorization ka difference?

**🎤 Short Interview Answer:** “JWT batata hai request kis identity ki hai. Owner ya share policy batati hai kaunsi file us identity ko allowed hai.”

**🧠 Easy Explanation:** Tum kaun ho versus tum kya access kar sakte ho. Source: Middleware identity; fileRoutes owner check.

**🔥 Follow-up:** Print pe authorization?

**🎤 Follow-up Answer:** “JWT hai, owner/share filter nahi. ID knowing ke saath any authenticated user URL le sakta hai.”

#### Q: Middleware order kyun important?

**🎤 Short Interview Answer:** “Upload route mein auth pehle aur Multer baad mein hai. Invalid identity ko upload work se pehle reject karna useful hai.”

**🧠 Easy Explanation:** Gate pe check storage work se pehle. Source: isAuthenticated → upload.single(file) → async handler.

**🔥 Follow-up:** Multer catch kahan?

**🎤 Follow-up Answer:** “Middleware error handler ke try se pehle aata hai. Central error middleware chahiye.”

#### Q: FormData kyun?

**🎤 Short Interview Answer:** “Browser file ko multipart parts mein bhejta hai. Field name file hai, jo upload.single se match hota hai.”

**🧠 Easy Explanation:** JSON form data aur binary multipart body alag formats hain. Source: Dashboard formData.append; multer middleware.

**🔥 Follow-up:** Content boundary?

**🎤 Follow-up Answer:** “Browser/Axios actual multipart boundary manage karta hai. Plain JSON parser file parse nahi karega.”

#### Q: Context state refresh par?

**🎤 Short Interview Answer:** “User aur fileId memory mein reset hote hain. Token localStorage mein bachta hai; restore logic absent hai.”

**🧠 Easy Explanation:** Saved token hona current React user state hona nahi. Source: AuthContext states default null.

**🔥 Follow-up:** QR timer?

**🎤 Follow-up Answer:** “Unmount cleanup interval rokta hai; refresh guaranteed cleanup trigger nahi.”

#### Q: ProtectedRoute security boundary hai?

**🎤 Short Interview Answer:** “UI ko user state ke basis par redirect karta hai. Actual data protection API par chahiye.”

**🧠 Easy Explanation:** Browser guard bypass ho sakta hai; backend decision trusted hona chahiye. Source: ProtectedRoute returns children or Navigate.

**🔥 Follow-up:** HOC hai?

**🎤 Follow-up Answer:** “Ye wrapper component using children hai. Conventional function returning another component HOC pattern nahi.”

#### Q: CORS kya karta hai?

**🎤 Short Interview Answer:** “Browser ko cross-origin response allow karta hai. Current origin:true broad reflection aur credentials:true hai.”

**🧠 Easy Explanation:** Browser access policy; API identity proof nahi. Source: server.js cors.

**🔥 Follow-up:** Curl ko rokega?

**🎤 Follow-up Answer:** “Nahi. Non-browser client CORS enforce nahi karta; auth/authorization required rehte hain.”

#### Q: Axios service layer hai?

**🎤 Short Interview Answer:** “Central baseURL aur withCredentials defaults main.jsx mein hain. Actual requests pages mein directly likhi hain.”

**🧠 Easy Explanation:** Defaults shared hain; reusable API service modules absent. Source: main.jsx and pages.

**🔥 Follow-up:** Interceptors use?

**🎤 Follow-up Answer:** “Nahi. Token pages manually header mein bhejti hain; refresh/error interceptor absent.”

#### Q: Print rendering sab formats support?

**🎤 Short Interview Answer:** “Current popup har file URL ko img mein load karta hai. Image flow hai; PDF/DOC viewer logic nahi.”

**🧠 Easy Explanation:** Allowed upload type aur printable renderer alag cheezein. Source: Print.handlePrint uses img regardless mimetype.

**🔥 Follow-up:** 5+ evaluated?

**🎤 Follow-up Answer:** “Six configured names hain; evaluation/test evidence absent hai.”

#### Q: useEffect cleanup bug?

**🎤 Short Interview Answer:** “Print select/drag listeners anonymous callbacks se add/remove hue. Removal same function reference nahi use karti.”

**🧠 Easy Explanation:** Same key bina purana lock khulta nahi; handler reference same chahiye. Source: Print.jsx listener cleanup.

**🔥 Follow-up:** Timer cleanup correct?

**🎤 Follow-up Answer:** “Interval clear hota hai. Lekin effect/side-effect state-updater design aur hook dependencies improve karni hain.”

#### Q: Upload failed toh UI kya rakhti hai?

**🎤 Short Interview Answer:** “selectedFile request se pehle set hoti hai; failure par reset absent. UI selected state stale reh sakti hai.”

**🧠 Easy Explanation:** Screen chosen file success proof nahi. Source: Dashboard.handleUpload.

**🔥 Follow-up:** Double upload?

**🎤 Follow-up Answer:** “Upload lock/idempotency absent; duplicate work possible; explicit progress/retry state add karo.”

#### Q: Refresh print scanner aur owner UI difference?

**🎤 Short Interview Answer:** “Print frontend public hai aur local token se API call kar sakti hai. Dashboard/QR context guard user null par login bhejta hai.”

**🧠 Easy Explanation:** Token persistence aur UI state restoration alag. Source: App/ProtectedRoute/AuthContext/Print.

**🔥 Follow-up:** Fresh scanner?

**🎤 Follow-up Answer:** “No token toh 401; no seamless QR login feature.”

#### Q: Body parsers file upload handle karte hain?

**🎤 Short Interview Answer:** “express.json aur urlencoded form bodies ke liye; multipart file Multer handle karta hai.”

**🧠 Easy Explanation:** Content-Type different parser select karta hai. Source: server.js; multer.js.

**🔥 Follow-up:** Malformed JSON?

**🎤 Follow-up Answer:** “Parser error route try se pehle; centralized safe errors needed.”

#### Q: Vite API base URL missing ho toh?

**🎤 Short Interview Answer:** “Axios relative URLs frontend origin par ja sakti hain; Vite API proxy configured nahi.”

**🧠 Easy Explanation:** Browser ko server address sahi milna chahiye. Source: main.jsx; vite.config.js.

**🔥 Follow-up:** Prod env secret?

**🎤 Follow-up Answer:** “VITE vars browser-visible; only API public baseURL, no server secrets.”

#### Q: User credentials and document token same hai?

**🎤 Short Interview Answer:** “Current JWT user identity hai; dedicated document share token absent. FileId URL se permission derive nahi karni.”

**🧠 Easy Explanation:** Identity card aur file ticket alag. Source: JWT login; print FileId.

**🔥 Follow-up:** Current share policy?

**🎤 Follow-up Answer:** “Not explicit; valid JWT plus known file ID sufficient for print route, gap hai.”

#### Q: GSAP aur reusable background ka role?

**🎤 Short Interview Answer:** “GSAP page elements animate karta hai; Animate reusable CSS glow background deta hai. Ye presentation layer ka kaam hai.”

**🧠 Easy Explanation:** Shared visual component repeated markup reduce karta hai; animation API state manage nahi karti. Source: Home/Login/Signup GSAP; Dashboard DOM ref; Animate five pages par, Print par nahi.

**🔥 Follow-up:** CSS alternative?

**🎤 Follow-up Answer:** “Simple animations CSS se possible; Animate already CSS pulses use karta hai.”

### Level 3 — Technical: 15

#### Q: JWT payload/expiry exact?

**🎤 Short Interview Answer:** “Application _id payload sign karti hai; library iat aur exp add karti hai. expiresIn 2h aur JWT_SECRET use hai.”

**🧠 Easy Explanation:** Signed identity card hai; plaintext payload decode ho sakta hai. Source: authController JWT.sign; authMiddleware verify.

**🔥 Follow-up:** JWT encrypted?

**🎤 Follow-up Answer:** “Nahi. Signing tamper detect karta hai; encryption confidentiality deta hai. Current JWT encryption nahi.”

#### Q: Invalid JWT status?

**🎤 Short Interview Answer:** “No token 401. Invalid ya expired token catch branch 400 Invalid token deti hai.”

**🧠 Easy Explanation:** Current status policy inconsistent hai. Source: authMiddleware.isAuthenticated.

**🔥 Follow-up:** Frontend 401 branch?

**🎤 Follow-up Answer:** “GenerateQR only 401 branch mein undefined logout call karti hai; invalid JWT 400 us branch mein nahi aata.”

#### Q: Cloud metadata mapping?

**🎤 Short Interview Answer:** “Storage engine secure_url ko path, public_id ko filename aur bytes ko size map karta hai. Route originalname ko display filename save karti hai.”

**🧠 Easy Explanation:** Engine ka filename cloud ID hai; user ka original filename alag. Source: multer-storage-cloudinary local lib; fileRoutes.

**🔥 Follow-up:** QR URL bhi secure?

**🎤 Follow-up Answer:** “QR controller response.url save karta hai, secure_url nahi.”

#### Q: public_id secret token hai?

**🎤 Short Interview Answer:** “Nahi. Asset identifier hai, deletion/storage management ke liye. Random component collision reduce karta hai.”

**🧠 Easy Explanation:** Random warehouse label permission ticket nahi. Source: multer public_id; utils generatePublicId.

**🔥 Follow-up:** Entropy?

**🎤 Follow-up Answer:** “Original random prefix 12 bytes, QR suffix 8 bytes. Ye share access secret ke roop mein use nahi hote.”

#### Q: Mongoose ref mismatch?

**🎤 Short Interview Answer:** “File.user ref User hai, but registered user model users hai. ID owner query work kar sakti hai; population mismatch fix chahiye.”

**🧠 Easy Explanation:** Reference ka model naam exactly match hona chahiye. Source: fileModel.js; userModel.js.

**🔥 Follow-up:** populate use?

**🎤 Follow-up Answer:** “Current source mein populate nahi; future use se pehle ref correct karo.”

#### Q: Unique email race?

**🎤 Short Interview Answer:** “findOne ke baad save independent hai. Concurrent registrations dono precheck pass kar sakti hain; DB unique index final guard hona chahiye.”

**🧠 Easy Explanation:** Pehle empty seat dekhna aur seat claim karna alag steps. Source: registerController; email unique true.

**🔥 Follow-up:** unique validator?

**🎤 Follow-up Answer:** “Nahi, index declaration hai. Duplicate-key error ko controlled response mein handle karo.”

#### Q: QR indexing?

**🎤 Short Interview Answer:** “QR queries fileId se hain, explicit index declaration nahi. fileId unique index proposed ho sakta hai if one QR per file policy.”

**🧠 Easy Explanation:** Search field par index reading help karta hai; duplicates bhi rule se handle karo. Source: qrModel; QRModel.findOne.

**🔥 Follow-up:** File owner compound index?

**🎤 Follow-up Answer:** “ID lookup already narrow hai. Explain plan measure karke add karo, blanket optimization claim nahi.”

#### Q: Transactions se full cleanup atomic?

**🎤 Short Interview Answer:** “Mongo transaction DB records group kar sakti hai. Cloudinary delete same transaction mein participate nahi karta.”

**🧠 Easy Explanation:** Do systems ko ek DB lock se commit nahi kara sakte. Source: Current delete sequence no transaction.

**🔥 Follow-up:** Reliable solution?

**🎤 Follow-up Answer:** “Deletion status DB mein save karunga. Worker retry karega; repeat delete safely chale, ye idempotent behavior hai. Cloud/DB state compare karke leftovers clean karunga.”

#### Q: Event loop kya role?

**🎤 Short Interview Answer:** “Node request handling JS event loop par hai. I/O await process ko other work karne deta hai; CPU work automatic parallel nahi.”

**🧠 Easy Explanation:** Wait ke time dusra kaam; heavy calculation phir bhi delay la sakti hai. Source: async handlers, bcrypt native async, QR encode.

**🔥 Follow-up:** Promise worker thread?

**🎤 Follow-up Answer:** “Promise scheduling primitive hai; CPU parallel worker guarantee nahi.”

#### Q: Middleware token header strict hai?

**🎤 Short Interview Answer:** “Second space-separated header item verify hota hai. Explicit Bearer prefix, issuer/audience policy aur user requery absent.”

**🧠 Easy Explanation:** Signature verified hona aur all auth policy configured hona alag. Source: authMiddleware.js.

**🔥 Follow-up:** Algorithm exploit proven?

**🎤 Follow-up Answer:** “Nahi; missing explicit policy ko demonstrated exploit nahi bolunga.”

#### Q: QR cloud save fails after upload response?

**🎤 Short Interview Answer:** “Upload response sab save stages ke baad send hota hai. QR failure response se pehle 500 deta hai; File/original remain kar sakte hain.”

**🧠 Easy Explanation:** Actual code order trace karo; invented reverse ordering avoid. Source: fileRoutes upload + qrcodeController.

**🔥 Follow-up:** Request response lost?

**🎤 Follow-up Answer:** “Server successful write ke baad network fail possible; retry idempotency needed.”

#### Q: Cloudinary destroy result types kya?

**🎤 Short Interview Answer:** “Helper ok par success true return karta hai; image not ok par raw try. Both fail resolved success false.”

**🧠 Easy Explanation:** Provider result interpret karna needed; await alone not enough. Source: utils/cloudinary.js.

**🔥 Follow-up:** CDN invalidation?

**🎤 Follow-up Answer:** “Custom delete helper flag absent; storage-engine remove hook separate invalidate:true use karta hai.”

#### Q: Upload validation before cloud complete hai?

**🎤 Short Interview Answer:** “Size cap and cloud allowed_formats present; server content sniff/fileFilter/antivirus/quota absent.”

**🧠 Easy Explanation:** Accepted extension true file content proof nahi. Source: multer.js.

**🔥 Follow-up:** Six print formats?

**🎤 Follow-up Answer:** “Configured names only; no format test evidence and img renderer limitation.”

#### Q: Profile/address fields actual schema?

**🎤 Short Interview Answer:** “User model name,email,password,phone plus timestamps hai. Address schema/save absent; profile update route nahi.”

**🧠 Easy Explanation:** Controller mention ko persisted field mat assume karo. Source: userModel; authController.

**🔥 Follow-up:** Login response address?

**🎤 Follow-up Answer:** “References nonexistent address; typically omitted JSON undefined. Feature proof nahi.”

#### Q: Server DB readiness startup?

**🎤 Short Interview Answer:** “connectDb await nahi; error catch logs only, listener starts anyway. Welcome root readiness probe nahi.”

**🧠 Easy Explanation:** Port open hona DB connected hona nahi. Source: server.js/db.js.

**🔥 Follow-up:** Fix?

**🎤 Follow-up Answer:** “Await successful DB, fail-fast configuration and separate readiness checks.”

### Level 4 — Senior/System Design: 10

#### Q: Upload partial failure strategy?

**🎤 Short Interview Answer:** “Abhi cloud upload ke baad DB/QR failure assets orphan chhod sakti hai. Durable stage state aur compensating cleanup chahiye.”

**🧠 Easy Explanation:** Half-complete kaam ki recovery list rakho. Source: Upload sequential handler.

**🔥 Follow-up:** Retry same request?

**🎤 Follow-up Answer:** “Current retry duplicate assets banati hai. Idempotency key and result state add karunga.”

#### Q: Stateless auth scaling enough?

**🎤 Short Interview Answer:** “JWT identity verification replicas par possible hai. Shared DB permissions, quotas aur consumed share state phir bhi required hain.”

**🧠 Easy Explanation:** Identity token independent hai; file business state nahi. Source: No local server session map; Mongo metadata.

**🔥 Follow-up:** Redis compulsory?

**🎤 Follow-up Answer:** “Nahi. Measured rate-limit/cache/queue coordination need ho tab recommended option hai.”

#### Q: What would you optimize first?

**🎤 Short Interview Answer:** “Pehle permission aur cleanup correctness fix karunga. Performance ke liye cloud-stage timings aur query plans measure karunga.”

**🧠 Easy Explanation:** Fast wrong answer se reliable correct behavior pehle. Source: No benchmark; sequential uploads.

**🔥 Follow-up:** QR async job?

**🎤 Follow-up Answer:** “Useful ho sakta hai, par pending status aur polling/error UX design required; current behavior synchronous hai.”

#### Q: Private file delivery kaise?

**🎤 Short Interview Answer:** “Backend permission and deadline validate karke private storage delivery authorize kare. Ordinary public URL ko time-limited signature se automatically private nahi bolunga.”

**🧠 Easy Explanation:** Address jaanne se gate bypass nahi hona chahiye. Source: Recommended; current path returns URL.

**🔥 Follow-up:** Signature expiry?

**🎤 Follow-up Answer:** “Provider ka documented expiry-aware method verify karo. URL signature alone universal expiration rule nahi.”

#### Q: Cleanup worker restart-safe?

**🎤 Short Interview Answer:** “Pending cleanup job/status DB mein save karunga. Restart ke baad worker resume karega; cloud delete confirm hone tak metadata rahegi.”

**🧠 Easy Explanation:** Pending work process memory ki jagah saved store mein, taaki restart se lose na ho. Source: Current browser interval only.

**🔥 Follow-up:** Two workers same job?

**🎤 Follow-up Answer:** “Worker temporary job claim (lease) karega, taaki ek worker process kare. Delete dobara chale toh safe rahe; ise idempotent bolte hain. Claim expire ho toh another worker retry kar sake.”

#### Q: 1M users architecture?

**🎤 Short Interview Answer:** “Traffic/file size measure karke API replicas, shared DB permission state, quotas aur cleanup workers add karunga. Current 1M support claim nahi.”

**🧠 Easy Explanation:** Registered account count batata nahi ki ek time par kitni requests aayengi. Source: Future architecture section 11 mein; current feature nahi.

**🔥 Follow-up:** Sharding first?

**🎤 Follow-up Answer:** “Nahi. Indexes/query plans, connection/cost limits aur workload inspect; partition only when needed.”

#### Q: SQL migration kab?

**🎤 Short Interview Answer:** “Strong relational sharing/audit workflows grow hon toh PostgreSQL reasonable choice hai. Current metadata model ke liye MongoDB bhi adequate ho sakta hai.”

**🧠 Easy Explanation:** Data aur query ki need ke hisaab se technology choose karo. Source: Current no SQL implementation.

**🔥 Follow-up:** Foreign keys Cloudinary sync?

**🎤 Follow-up Answer:** “SQL foreign key DB relationships check karti hai. Cloud delete same transaction mein nahi aati; failed stage recover karna phir bhi required hai.”

#### Q: Cache kya store kare?

**🎤 Short Interview Answer:** “Non-sensitive metadata selectively cache karunga; permission/expiry state stale serve nahi karni. Delivered public URLs ka long cache policy risky ho sakta hai.”

**🧠 Easy Explanation:** Expired key ka cached gate-open answer avoid karo. Source: App cache absent; Cloudinary ki delivery cache separate system hai.

**🔥 Follow-up:** Revocation?

**🎤 Follow-up Answer:** “Cache expiry alone immediate access removal prove nahi. Final allow/deny server ki latest permission check kare.”

#### Q: Microservices kyun nahi?

**🎤 Short Interview Answer:** “Current small prototype mein single API simpler hai. Load/resource and team boundaries justify karein tab separate services consider karunga.”

**🧠 Easy Explanation:** Har feature ke liye separate server unnecessary complexity ho sakti hai. Source: One Express app with three router mounts.

**🔥 Follow-up:** Scaling uploads?

**🎤 Follow-up Answer:** “Pehle extra API copies aur background workers measure karunga. Ek part ko alag deploy karne ki need ho tab separate service consider karunga.”

#### Q: Production-ready claim?

**🎤 Short Interview Answer:** “Current checkout prototype hai. Lint failures, expiry/ownership gaps, startup and retry issues fix/test hone chahiye.”

**🧠 Easy Explanation:** Deploy ho jaana production quality ka complete proof nahi. Source: Config/source plus actual build/lint.

**🔥 Follow-up:** Uptime metric?

**🎤 Follow-up Answer:** “Static Home stats measured evidence nahi; real monitoring data absent.”

### Security/Resume Traps: 10

#### Q: Biggest security gap?

**🎤 Short Interview Answer:** “Print route identity check karti hai, file permission nahi. Direct asset URL aur no server expiry is risk ko aur badhate hain.”

**🧠 Easy Explanation:** Valid user hona har file ka owner hona nahi. Source: printRoutes findById only.

**🔥 Follow-up:** First fix?

**🎤 Follow-up Answer:** “Owner-only or explicit share-capability policy choose karke every read par enforce karo.”

#### Q: Secrets env mein safe hain?

**🎤 Short Interview Answer:** “Env use correct separation hai, but MONGO_URL full log hoti hai. Secret validation aur redacted logs missing hain.”

**🧠 Easy Explanation:** Secret source safe hone ke baad log mein leak ho sakta hai. Source: db.js console.log; ignored env.

**🔥 Follow-up:** Rotation?

**🎤 Follow-up Answer:** “Exposure detected ho toh relevant secret rotate aur log access review karo; actual exposure history unverified hai.”

#### Q: Browser copy controls sufficient?

**🎤 Short Interview Answer:** “Nahi. Client events easy bypass hain, URL already response mein hai. Downloaded bytes ko back-end delete revoke nahi karta.”

**🧠 Easy Explanation:** Recipient content dekhe toh photograph ya local copy possible. Source: Print listeners and cloud URL.

**🔥 Follow-up:** Better boundary?

**🎤 Follow-up Answer:** “Backend authorization, short private delivery, cleanup and clear recipient-copy limitation.”

#### Q: Resume AES claim defend karo.

**🎤 Short Interview Answer:** “AES implementation present nahi. crypto.randomBytes ID generation hai; encrypted links ka claim correct karna chahiye.”

**🧠 Easy Explanation:** Randomness, hashing, signing aur encryption different tools hain. Source: No encrypt/decrypt pipeline.

**🔥 Follow-up:** Why keyword included?

**🎤 Follow-up Answer:** “Resume wording implementation se match nahi; reason invent nahi karunga, safe wording use karunga.”

#### Q: QR authentication ka proof?

**🎤 Short Interview Answer:** “Login JWT authentication karta hai. QR frontend print URL carry karta hai; authentication token nahi.”

**🧠 Easy Explanation:** QR transport format hai. Source: qrcodeController; printRoutes isAuthenticated.

**🔥 Follow-up:** Fresh shop scan?

**🎤 Follow-up Answer:** “Local token absent hone par backend 401; seamless public sharing current code support nahi karti.”

#### Q: 99% misuse reduction methodology?

**🎤 Short Interview Answer:** “Repository mein evaluation methodology ya measured data nahi. Is metric ko implemented/measured result nahi bolunga.”

**🧠 Easy Explanation:** Number ke liye baseline, dataset and test design chahiye. Source: Resume source only; Home stats static.

**🔥 Follow-up:** 5+ document formats?

**🎤 Follow-up Answer:** “Six format options configured hain; six tested printable formats ka evidence absent.”

#### Q: No server storage means server sees nothing?

**🎤 Short Interview Answer:** “Nahi. Original stream backend se Cloudinary jaati hai. Local disk persistence absent hai; server trusted path mein hai.”

**🧠 Easy Explanation:** Cloud forwarding privacy from server guarantee nahi. Source: Storage engine file.stream pipe.

**🔥 Follow-up:** End-to-end encryption?

**🎤 Follow-up Answer:** “Absent. User-held key/client encrypt flow nahi.”

#### Q: Sab tumne banaya?

**🎤 Short Interview Answer:** “Available Git history specific configuration/docs work attribute karti hai. Entire app ko sole personal contribution bolna verified nahi.”

**🧠 Easy Explanation:** Team repo aur commit authorship context needed. Source: Prince d285e86 and docs commits; Sujal earlier history.

**🔥 Follow-up:** Hardest bug story?

**🎤 Follow-up Answer:** “Actual symptom and test evidence ke bina invented story nahi. Verified diff explain karunga.”

#### Q: Zero retention evidence kaise evaluate?

**🎤 Short Interview Answer:** “Check original/QR cloud assets, DB records, caches and recipient copies separately. Current source complete erasure prove nahi.”

**🧠 Easy Explanation:** Retention scope clear hona chahiye. Source: Delete/helper/QR model; resume bullet2.

**🔥 Follow-up:** Safe resume?

**🎤 Follow-up Answer:** “Browser-triggered cleanup attempt say; no trace/zero copies claim remove.”

#### Q: Secure session wording ka safe replacement?

**🎤 Short Interview Answer:** “Two-hour signed JWT and local browser logout implemented hain; restore/refresh/revoke lifecycle absent.”

**🧠 Easy Explanation:** Useful feature ko precise scope mein bolo. Source: AuthContext, authController, middleware.

**🔥 Follow-up:** HttpOnly solves everything?

**🎤 Follow-up Answer:** “Nahi. CSRF/SameSite and revocation/permissions design still needed.”

<a id="section-16"></a>

## 16. Cross-Questioning

Seven drilling chains; no full theory. Candidate lines ko aloud rehearse karo.

### MongoDB drill

**Interviewer:** Why MongoDB?

**🎤 Candidate:** “Accounts aur file/QR metadata documents Mongoose se map hote hain; universally faster claim nahi.”

**Interviewer:** Why not PostgreSQL?

**🎤 Candidate:** “Valid alternative hai; relational constraints/reporting grow hon toh useful.”

**Interviewer:** 1M users?

**🎤 Candidate:** “Workload define karke query plans, indexes, quotas aur replicas measure karunga; guaranteed capacity claim nahi.”

### QR drill

**Interviewer:** QR mein secret kya?

**🎤 Candidate:** “Current QR mein frontend print URL/File ID hai, separate secret token nahi.”

**Interviewer:** Copy kar liya toh?

**🎤 Candidate:** “Same URL reuse ho sakta hai; consumed-state check nahi.”

**Interviewer:** JWT sufficient?

**🎤 Candidate:** “Identity verify karta hai, file permission nahi; current print route gap hai.”

### Expiry drill

**Interviewer:** 60-second access?

**🎤 Candidate:** “Repository mein nahi. Browser timer 20 seconds hai.”

**Interviewer:** 59 versus 61?

**🎤 Candidate:** “No server cutoff; File existence and JWT determine API result.”

**Interviewer:** Tab close?

**🎤 Candidate:** “Timer stops; no server job schedules deletion.”

### Cloud drill

**Interviewer:** Local server sees file?

**🎤 Candidate:** “Haan, stream server ke through cloud jaati hai; disk persistence configured nahi.”

**Interviewer:** Private cloud URL?

**🎤 Candidate:** “Private delivery config absent; live account restrictions unverified.”

**Interviewer:** Delete 200 means gone?

**🎤 Candidate:** “Nahi, helper false result route ignore karti hai.”

### Auth drill

**Interviewer:** JWT encrypted?

**🎤 Candidate:** “Signed hai, encrypted nahi. Payload readable hai; signature tampering detect karta hai.”

**Interviewer:** Logout revoke?

**🎤 Candidate:** “Only local removal; server revoke absent.”

**Interviewer:** HttpOnly cookie fix all?

**🎤 Candidate:** “JS token read reduce karegi, but CSRF/SameSite and other security design chahiye.”

### Resume drill

**Interviewer:** AES proof?

**🎤 Candidate:** “Encryption implementation absent; wording correct karna chahiye.”

**Interviewer:** Zero retention proof?

**🎤 Candidate:** “No; cloud failure/QR cache/local copies remain possible.”

**Interviewer:** 99% improvement?

**🎤 Candidate:** “No benchmark or methodology found.”

### Reliability drill

**Interviewer:** Original upload success Mongo fails?

**🎤 Candidate:** “Orphan cloud asset; current rollback absent.”

**Interviewer:** Retry upload?

**🎤 Candidate:** “New asset/File ID create ho sakta hai; idempotency absent.”

**Interviewer:** Database transaction fix?

**🎤 Candidate:** “Mongo parts group, external cloud operation cannot join.”

<a id="section-17"></a>

## 17. Mock Interview

18-question interview run. Short answers only; harder technical follow-ups section 15 / 16 mein.

**1. Interviewer:** Kawach 20 seconds mein explain karo.

**🎤 Candidate:** “Document cloud upload, metadata Mongo mein aur print URL QR se sharing. JWT login present; expiry/cleanup guarantees limited.”

**2. Interviewer:** Data storage boundary draw karo.

**🎤 Candidate:** “Mongo account/File/QR metadata. Cloudinary original bytes and QR PNG. App local disk persistence absent.”

**3. Interviewer:** Upload success kab send hota?

**🎤 Candidate:** “Original cloud upload, File save, QR cloud upload aur QR save complete hone ke baad.”

**4. Interviewer:** Why auth before Multer?

**🎤 Candidate:** “Unauthorized caller ko costly storage work se pehle reject karta hai.”

**5. Interviewer:** Signup ke baad redirect weird kyun?

**🎤 Candidate:** “No login/context update; navigate dashboard then guard sends fresh user to login.”

**6. Interviewer:** Login token scope?

**🎤 Candidate:** “User _id signed with 2h expiry; file-specific permission or one-time usage not inherent.”

**7. Interviewer:** QR scanner token kaise paata?

**🎤 Candidate:** “QR JWT carry nahi karta. Scanner needs own browser token; fresh browser401.”

**8. Interviewer:** Print unauthorized object ka concern?

**🎤 Candidate:** “Valid JWT but findById only; any authenticated known FileId can get URL.”

**9. Interviewer:** 20/60 claim cross-check?

**🎤 Candidate:** “React starts 20 seconds; progress denominator60 stale. Backend no expiresAt comparison.”

**10. Interviewer:** Printer popup proves print complete?

**🎤 Candidate:** “No. img onload opens browser dialog; afterprint/timeout close attempts, no physical proof/consume API.”

**11. Interviewer:** Cloudinary delete succeeds but QR image?

**🎤 Candidate:** “Current custom delete only original asset; QR Mongo record removed but cloud PNG orphan.”

**12. Interviewer:** API200 but cloud survives?

**🎤 Candidate:** “Helper resolved false result route ignores; DB metadata deleted despite failed cloud operation.”

**13. Interviewer:** Client loses upload response; user retry?

**🎤 Candidate:** “First request may already save assets; retry creates new ones unless idempotency planned.”

**14. Interviewer:** One server multiple replicas mein kya shared?

**🎤 Candidate:** “Database permissions/expiry/redemption and durable job state; not per-process in-memory consume map.”

**15. Interviewer:** Capacity numbers defend?

**🎤 Candidate:** “No measured benchmark. Measure workload/concurrency/file sizes before throughput/1M claims.”

**16. Interviewer:** AES / 99% resume claim?

**🎤 Candidate:** “No encryption pipeline/evaluation evidence. Correct wording instead of falsely defending metrics.”

**17. Interviewer:** Your personal contribution?

**🎤 Candidate:** “Available Prince Git commits show CORS credentials/DNS and docs; full-stack sole authorship unverified.”

**18. Interviewer:** Production fix order?

**🎤 Candidate:** “Pehle file permission, server expiry aur private delivery. Phir saved cleanup retries, input/rate/token/log controls aur targeted tests.”

<a id="section-18"></a>

## 18. Rapid Fire

45 unique one-line drills. Main deep explanations upar hain.

**Q1: Actual QR payload?**

A: Frontend /print/FileId URL; JWT/secret token nahi.

**Q2: QR generate location?**

A: Backend upload ke during, frontend GET only fetch.

**Q3: Current browser countdown?**

A: 20 seconds; trusted server deadline nahi.

**Q4: 59 vs61 result?**

A: No time-specific gate; File existence and JWT decide.

**Q5: True single use?**

A: No consumed-state/atomic redemption.

**Q6: Scanner fresh browser?**

A: Own JWT absent toh print API401.

**Q7: Print owner check?**

A: Missing; QR/delete owner checks present.

**Q8: JWT expiration?**

A: 2h; share lifetime se different.

**Q9: Missing vs bad JWT?**

A: 401 missing; 400 invalid/expired.

**Q10: JWT confidentiality?**

A: Signed readable payload; encrypted nahi.

**Q11: bcrypt cost?**

A: 10; one-way password hash.

**Q12: Signup automatic login?**

A: No token/context login; fresh guard redirects.

**Q13: Server logout/revoke?**

A: Absent; browser local removal only.

**Q14: Refresh user/fileId?**

A: Context reset; token remains, restore absent.

**Q15: File multipart field?**

A: file, matching upload.single(file).

**Q16: Size limit?**

A: 10,485,760 bytes,10 MiB.

**Q17: Allowed formats?**

A: jpg/jpeg/png/pdf/doc/docx configured, not evaluation proof.

**Q18: Full MIME/content validation?**

A: No custom sniffing/fileFilter/scan.

**Q19: Local disk used?**

A: No app persistence configured; backend still streams bytes.

**Q20: Original cloud metadata?**

A: secure_url→path; public_id→filename; bytes→size.

**Q21: QR image URL stored?**

A: response.url; encoded print URL stored separately.

**Q22: Folders?**

A: uploads for originals; qrcodes for QR PNG.

**Q23: Original public-ID random bytes?**

A: 12-byte hex prefix plus originalname.

**Q24: QR public-ID random bytes?**

A: 8 bytes plus timestamp, asset naming only.

**Q25: QR error correction?**

A: H; redundancy, not security/encryption.

**Q26: File Buffer used?**

A: No; content optional field unused.

**Q27: User ref mismatch?**

A: File ref User; actual registered model users.

**Q28: QR fileId index?**

A: No explicit index/unique declaration in schema.

**Q29: TTL current?**

A: Absent; Date.now defaults are not expiry.

**Q30: Custom deletion order?**

A: Original destroy attempt → QR Mongo → File Mongo.

**Q31: Cloud false result handled?**

A: No; route ignores helper success:false.

**Q32: QR cloud removal?**

A: Absent; public_id not stored.

**Q33: Custom delete CDN invalidate?**

A: Not set; storage-engine remove hook separate.

**Q34: After print delete request?**

A: No; window close/navigation only.

**Q35: PDF/DOC renderer?**

A: Absent; popup always img.

**Q36: Undefined QR error branch?**

A: logout() not destructured on 401.

**Q37: Timer progress bug?**

A: timeLeft/60 despite initial 20.

**Q38: Sensitive startup log?**

A: db.js full MONGO_URL.

**Q39: Register response risk?**

A: Full saved user includes password hash.

**Q40: CORS policy?**

A: origin:true reflection with credentials:true.

**Q41: Measured performance?**

A: No measured benchmark was found.

**Q42: Build/lint evidence?**

A: Earlier build pass; lint26 errors / 2 warnings.

**Q43: Worker/Redis current?**

A: Absent; recommended future options only.

**Q44: AES/self-destruct/99% evidence?**

A: Unsupported guarantees/metrics; cleanup attempt only.

**Q45: Personal contribution proof?**

A: Prince configuration/docs commits; sole app authorship not proved.

<a id="section-19"></a>

## 19. Final 10-Minute Revision

35 highest-value spoken answers. Just before interview ye section read karo.

### 1. What is Kawach?

🎤 **Answer:** “MERN document-sharing/browser-printing prototype hai. Cloudinary upload aur print URL ka QR use karta hai.”

### 2. What problem does it solve?

🎤 **Answer:** “Print shop ko document dene ke baad retention/copy risk reduce karne ka goal hai. Complete prevention guarantee current code nahi deta.”

### 3. Architecture?

🎤 **Answer:** “React SPA → Express API → Mongo metadata aur Cloudinary assets. Single API app hai, microservices absent.”

### 4. Complete upload flow?

🎤 **Answer:** “JWT → Multer cloud stream → File save → QR PNG cloud upload → QR save → response.”

### 5. Authentication?

🎤 **Answer:** “Email/password login aur bcrypt compare ke baad two-hour JWT. Protected APIs token verify karti hain.”

### 6. Authorization?

🎤 **Answer:** “QR fetch aur delete owner filter karte hain. Print route owner/share check miss karti hai.”

### 7. JWT?

🎤 **Answer:** “Signed identity token, encrypted message nahi. _id application payload, library iat/exp; localStorage Bearer use.”

### 8. MongoDB?

🎤 **Answer:** “Accounts, original-file metadata aur QR metadata store karta hai. File bytes Cloudinary mein.”

### 9. Multer?

🎤 **Answer:** “Multipart file request parse karke Cloudinary storage engine ko stream deta hai. Field file, single upload.”

### 10. Cloudinary?

🎤 **Answer:** “Original documents aur QR PNG ka remote asset store/delivery. PublicId deletion identifier hai.”

### 11. QR generation?

🎤 **Answer:** “Backend upload ke during qrcode.toBuffer with H/png. PNG cloud mein aur URL Mongo QR record mein.”

### 12. How QR access works?

🎤 **Answer:** “QR frontend print URL/File ID carry karta hai. Scanner browser ko its own JWT chahiye; current print permission gap hai.”

### 13. 60-second access?

🎤 **Answer:** “Repository mein server par 60-second expiry absent. GenerateQR browser countdown 20 seconds use karta hai.”

### 14. How expiry enforced?

🎤 **Answer:** “Current server deadline check nahi. Active browser timer DELETE attempt karti hai; future server expiresAt needed.”

### 15. Automatic deletion?

🎤 **Answer:** “Browser-triggered owner DELETE path original cloud cleanup try aur Mongo records delete karti hai. Reliable independent job absent.”

### 16. Security?

🎤 **Answer:** “Hashing/JWT/limited owner checks useful hain. Complete security, copy prevention aur retention guarantees unsupported.”

### 17. Encryption?

🎤 **Answer:** “AES/document E2EE pipeline absent. crypto.randomBytes IDs ke liye, bcrypt passwords ke liye.”

### 18. IDOR?

🎤 **Answer:** “Known file ID ke saath any valid JWT print URL le sakta hai; route ownership/share authorization miss karti hai.”

### 19. File upload security?

🎤 **Answer:** “10 MiB limit aur six format strings configured. Content sniffing/virus scan/quotas absent.”

### 20. One-time access?

🎤 **Answer:** “Consumed-state/atomic redemption absent; print GET state mutate nahi karti. Reuse possible while File exists.”

### 21. React flow?

🎤 **Answer:** “Context user/fileId share karta hai, pages API call karti hain, router view choose karta hai. Refresh restoration absent.”

### 22. Express flow?

🎤 **Answer:** “Routes auth/file/print mounts par hain. Some controllers separated; file/print business logic inline routes mein.”

### 23. Biggest limitation?

🎤 **Answer:** “Server expiry aur durable confirmed cleanup missing hain. Browser close se cleanup skip ho sakti hai.”

### 24. Biggest security concern?

🎤 **Answer:** “Print permission gap aur direct file URL main concern hain. Server permission check aur private file access pehle fix karunga.”

### 25. Cloudinary failure?

🎤 **Answer:** “Original middleware error upload fail karti hai; later QR failure partial state chhod sakti hai. Recovery tracking missing.”

### 26. MongoDB failure?

🎤 **Answer:** “Connection failure log hota hai but server listen continues. Upload after cloud save DB failure orphan asset chhod sakti hai.”

### 27. How scale?

🎤 **Answer:** “Workload measure, quotas/indexes, API replicas and durable workers. Shared permission state keep; capacity numbers invent nahi.”

### 28. What did YOU build?

🎤 **Answer:** “Git mein Prince-authored CORS credentials/DNS changes aur docs visible hain. Entire application sole authorship verified nahi.”

### 29. Biggest technical challenge?

🎤 **Answer:** “Code-level difficult area cross-system partial failure and cleanup reliability hai. Personal hardest contribution history se infer nahi karunga.”

### 30. Biggest bug?

🎤 **Answer:** “Verified serious issue print permission gap hai; cleanup false-success bhi hai. Inko personally solved past bug nahi bolunga.”

### 31. What improve?

🎤 **Answer:** “Authz/server expiry/private delivery first; durable cleanup, input validation/rate limits, then error/loading and tests.”

### 32. Make production-ready?

🎤 **Answer:** “Permission/expiry/cleanup fixes, safe logs/secret validation, startup readiness, auth lifecycle, regression/load tests and monitoring.”

### 33. Handle 1M users?

🎤 **Answer:** “1M accounts versus concurrent uploads define karke capacity test. Replicas/private delivery/worker quotas plan; current 1M support unverified.”

### 34. Secure QR links?

🎤 **Answer:** “Future token ka hash save karunga. Server time/use ek atomic operation mein check kare; winner ko short file-only session mile. Current File ID URL ye security nahi deta.”

### 35. Explain in30 seconds.

🎤 **Answer:** “Kawach mein JWT login ke baad file Cloudinary jaati hai; Mongo metadata aur backend print URL ka QR save hote hain. Owner page 20-second deletion attempt karti hai; one-time use, server expiry aur confirmed cleanup improve karne hain.”
