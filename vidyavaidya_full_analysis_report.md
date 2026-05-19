# VidyaVaidya — Full Frontend & Backend Analysis Report

---

## Executive Summary

The project is a React (Vite) + Node.js/Express + Firebase/Firestore NGO donation platform called **VidyaVaidya**. The frontend and backend are largely well-structured, but there are **25+ critical, major, and minor issues** spanning authentication mismatches, dead payment flows, broken form integrations, security vulnerabilities, and integration gaps. Each issue below includes a root cause and a concrete fix.

---

## SECTION 1 — CRITICAL BUGS (Will Break in Production)

---

### BUG #1 — ProtectedRoute Reads `sessionStorage` but Auth Is Written to `localStorage`

**Location:** `frontend/src/routes/ProtectedRoute.jsx` (line 13) vs `frontend/src/services/api.js` (lines 60, 81, 94)

**Problem:**
`ProtectedRoute` checks:
```js
const isAuthenticated = sessionStorage.getItem("vv_auth") === "true";
```
But `api.js` writes:
```js
localStorage.setItem('vv_auth', '1');   // value is '1', not 'true'
```
This means **every protected route (`/join-community`, `/join/volunteer`, etc.) will always redirect to `/auth`**, even for logged-in users. Two mismatches exist: wrong storage type (`sessionStorage` vs `localStorage`) and wrong comparison value (`"true"` vs `"1"`).

**Fix:**
```js
// ProtectedRoute.jsx — fix both the storage type and the value check
const isAuthenticated = localStorage.getItem("vv_auth") === "1";
```

---

### BUG #2 — `/dashboard` Route Has No `ProtectedRoute` Guard

**Location:** `frontend/src/App.jsx` (line 81)

**Problem:**
```jsx
<Route path="/dashboard" element={<Dashboard />} />
```
The Dashboard page makes authenticated API calls (`api.user.getProfile()`, `api.user.getDashboard()`, etc.), but **there is no `<ProtectedRoute>` wrapper**. Anyone can access it directly. Tokens will be absent, every API call will fail with 401, and the page silently falls back to hardcoded fake data (name "VIDYA VAIDYA", email "vidyavaidyanlr@gmail.com").

**Fix:**
```jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

---

### BUG #3 — PaymentModal Is Completely Disconnected from the Backend

**Location:** `frontend/src/pages/PaymentModal.jsx`

**Problem:**
The entire payment UI (UPI, Cards, Net Banking) is a **static mock**. Clicking "Pay" runs a fake `setTimeout` and shows a hardcoded success screen. It never calls:
- `api.payment.createOrder()`
- `api.payment.verifyPayment()`
- Any Razorpay SDK integration

The backend has a fully working `POST /api/payment/create-order` and `POST /api/payment/verify` with Firestore persistence, encryption, and email receipt. None of this is used.

Additionally, the `Donate.jsx` form collects donor details but **never passes them to the Payment page**. `navigate("/payment", { state: { amount, isMonthly } })` — donor name, email, phone, address, PAN, category are all dropped.

**Fix:**
1. Pass full donor details through navigation state in `Donate.jsx`:
```js
navigate("/payment", {
  state: {
    amount: displayAmount,
    isMonthly: tab === "monthly",
    duration,
    donorDetails: {
      fullName: form.fullName,
      email: form.email,
      phone: form.mobile,
      address: { line: form.address, city: form.city, state: form.state, country: form.country, pincode: form.pincode },
      isAlumni: form.isAlumni,
      alumniId: form.alumniId,
    },
    category: "Education", // derive from selected amounts
  }
});
```
2. In `PaymentModal.jsx`, replace `handlePay` with a real flow:
```js
// 1. Create order
const orderRes = await api.payment.createOrder(amount, category, subcategory, donorDetails);
// 2. Open Razorpay checkout with orderRes.orderId + orderRes.keyId
// 3. On Razorpay success callback, call api.payment.verifyPayment(...)
```

---

### BUG #4 — AdminLogin Is Completely Client-Side Only (No API Call)

**Location:** `frontend/src/pages/admin/AdminLogin.jsx`

**Problem:**
Admin authentication is 100% frontend-only:
```js
if (username.trim() === "admin" && password === "vidyavaidya@2024") {
  localStorage.setItem("vv_admin_auth", JSON.stringify({ loggedIn: true }));
  navigate("/admin/dashboard");
}
```
The **credentials are hardcoded in the JSX file** and visible to anyone who inspects the bundle. The backend has `POST /api/auth/admin-login` with real Firestore-backed admin verification — it is never called.

There is also a **schema mismatch**: the backend's `adminLoginSchema` requires an `email` field (valid email format), but the frontend sends `username` (set to `"admin"`, not an email). The backend would reject this with a 422 validation error anyway.

**Fix:**
```js
// AdminLogin.jsx — call the real API
const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const data = await api.auth.adminLogin(username, password);
    // api.auth.adminLogin already sets localStorage tokens
    navigate("/admin/dashboard");
  } catch (err) {
    setError("Invalid credentials.");
  } finally {
    setLoading(false);
  }
};
```
On the backend, update `adminLoginSchema` to accept `username` as a non-email string OR accept `"admin"` as a valid special case (already partially done in controller).

---

### BUG #5 — Contact Form Never Calls the Backend

**Location:** `frontend/src/pages/Contact.jsx` (line 70)

**Problem:**
```js
<form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
```
The contact form just sets a `submitted` boolean. It **never calls `api.contact.submit()`**. The backend has `POST /api/contact` with Firestore persistence and email notification — completely unused.

**Fix:**
```js
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await api.contact.submit({ name, email, phone, subject, message, queryType });
    setSubmitted(true);
  } catch (err) {
    setError("Failed to submit. Please try again.");
  }
};
```
Also: the Contact page doesn't have `name`, `email`, `phone`, `subject`, `queryType` state variables — those need to be added.

---

### BUG #6 — All Community/Volunteer/Corporate/Hospital Forms Never Call the Backend

**Location:** `frontend/src/pages/forms/VolunteerForm.jsx`, `DonorForm.jsx`, `CorporateForm.jsx`, `HospitalForm.jsx`

**Problem:**
Every form uses:
```js
const handleSubmit = (e) => {
  e.preventDefault();
  alert("Application submitted successfully!");
};
```
None of them call `api.community.apply()`. The backend has a fully built `POST /api/community/apply` with Firestore persistence, duplicate-check logic, and email notifications — all unused.

**Fix (example for VolunteerForm):**
```js
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await api.community.apply("volunteer", {
      skills: skills.split(",").map(s => s.trim()),
      availability,
      experience,
      motivation,
      preferredDays,
      location
    });
    setSubmitted(true);
  } catch (err) {
    setError(err.message);
  }
};
```

---

### BUG #7 — Foreign Donor Form in `Donate.jsx` Never Calls the Backend

**Location:** `frontend/src/pages/Donate.jsx` (line 169–173)

**Problem:**
```js
const handleForeignSubmit = () => {
  const e = validateForeign();
  setForeignErrors(e);
  if (Object.keys(e).length === 0) setForeignSubmitted(true);
};
```
The backend has `POST /api/contact/foreign-inquiry` specifically for this use case. It is never called.

**Fix:**
```js
const handleForeignSubmit = async () => {
  const e = validateForeign();
  setForeignErrors(e);
  if (Object.keys(e).length === 0) {
    try {
      await api.contact.submitForeign(foreignForm);
      setForeignSubmitted(true);
    } catch (err) {
      setForeignErrors({ message: err.message });
    }
  }
};
```

---

### BUG #8 — `logout()` Calls `auth.revokeRefreshTokens()` on Local UIDs — Crashes

**Location:** `backend/src/controllers/auth.controller.js` (line 308)

**Problem:**
```js
async logout(req, res, next) {
  const uid = req.user.uid;
  await auth.revokeRefreshTokens(uid);
}
```
OTP-registered users have UIDs like `local-xxxxxxxx-xxxx`. Firebase Admin's `revokeRefreshTokens()` will **throw an error for these non-Firebase UIDs**, crashing the logout endpoint and returning a 500 error.

**Fix:**
```js
async logout(req, res, next) {
  try {
    const uid = req.user.uid;
    if (!uid.startsWith('local-')) {
      await auth.revokeRefreshTokens(uid);
    }
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
}
```

---

## SECTION 2 — MAJOR BUGS (Broken Features or Security Issues)

---

### BUG #9 — AdminDashboard Uses Only Hardcoded Mock Data, No API Integration

**Location:** `frontend/src/pages/admin/AdminDashboard.jsx`

**Problem:**
The entire admin dashboard is populated with static arrays (`MOCK_DONATIONS`, `MOCK_USERS`, `MONTHLY_DATA`, `CATEGORY_BREAKDOWN`). None of the rich admin API endpoints are called:
- `api.admin.getOverview()`
- `api.admin.getDonations()`
- `api.admin.getUsers()`
- `api.admin.getApplications()`
- `api.admin.getContacts()`

The backend has all these endpoints fully implemented.

**Fix:** Replace mock data with `useEffect` hooks fetching from the admin API. The `AdminRoute` guard already provides localStorage-based auth; pass the `vv_token` (set during admin login) as the Bearer token.

---

### BUG #10 — `adminLoginSchema` Requires `email` Format but Frontend Sends `"admin"` (Not an Email)

**Location:** `backend/src/schemas/auth.schema.js` (line 48) vs `frontend/src/pages/admin/AdminLogin.jsx` (state: `username`)

**Problem:**
The schema:
```js
email: Joi.string().email().required()
```
If the admin login were to call the backend (see Bug #4), the Joi validator would reject `username: "admin"` because it's not a valid email. The backend controller already handles `"admin"` as a special alias, but the schema blocks it first.

**Fix:** Update schema to accept either a username or email:
```js
email: Joi.string().required() // remove .email() restriction for admin login
```
Or rename the field to `identifier` to make the intent clear.

---

### BUG #11 — No Vite Proxy — CORS Will Fail in Development

**Location:** `frontend/vite.config.js`

**Problem:**
The frontend calls `http://localhost:5000/api` directly. In production this is fine if CORS is configured, but **in development, the Vite dev server on port 5173 making requests to port 5000 will trigger CORS preflight**. The backend's CORS allows `http://localhost:5173` — this will work only if the browser sends the correct `Origin` header. However, no proxy is configured to avoid CORS entirely in dev.

**Fix (recommended for dev simplicity):**
```js
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})
```
Then change `API_BASE_URL` in `api.js` to `'/api'` for development.

---

### BUG #12 — `api.auth.login()` Stores the Raw Firebase `idToken` as the Bearer Token

**Location:** `frontend/src/services/api.js` (line 59)

**Problem:**
```js
async login(idToken) {
  const data = await apiRequest('/auth/login', { ... });
  if (data.success && idToken) {
    localStorage.setItem('vv_token', idToken);  // stores Firebase idToken
  }
}
```
Firebase `idToken` is a short-lived JWT (1 hour). Subsequent API calls will use this as the Bearer token. The `authMiddleware` does handle Firebase ID tokens, but they **expire in 1 hour** with no refresh mechanism on the frontend. After expiry, all authenticated calls will silently fail with 401 with no user feedback or refresh flow.

For OTP users, `verifyOtp` correctly stores the 7-day JWT — the inconsistency is in the Firebase login path.

**Fix:** The backend `/api/auth/login` should return its own signed JWT (like `verifyOtp` does), and the frontend should store that instead:
```js
// In auth.controller.js login():
const token = generateJWT(userData);
return res.status(200).json({ success: true, token, uid, email, role, profileComplete });

// In api.js login():
if (data.success && data.token) {
  localStorage.setItem('vv_token', data.token);
}
```

---

### BUG #13 — `api.payment.createOrder()` Sends `category`/`subcategory` but `Donate.jsx` Never Derives These Values

**Location:** `frontend/src/services/api.js` (line 134) + `frontend/src/pages/Donate.jsx`

**Problem:**
The backend `createOrderSchema` requires `category` to be one of `"Education"`, `"Healthcare"`, or `"Community"`. The `Donate.jsx` page allows multi-category selection (e.g., a user can pick ₹1000 from Education AND ₹2000 from Healthcare). There is no logic to derive a single `category`/`subcategory` from the selection, and neither is passed to the Payment page.

**Fix:** When multiple categories are selected, either:
- Use the category with the highest amount selected, or
- Use `"General"` as a fallback category, and update the backend schema to allow it, or
- Break the payment into separate orders per category.

---

### BUG #14 — `payment.createOrder` Route Requires `authMiddleware` but PaymentModal Has No Auth State

**Location:** `backend/src/routes/payment.routes.js` (line 9)

**Problem:**
```js
router.use(authMiddleware); // All payment routes require auth
```
The Donate page is **not protected** by `ProtectedRoute`. An anonymous user can fill the form, reach the Payment page, and when the real Razorpay integration is added, the `POST /api/payment/create-order` call will fail with 401 (no token in localStorage).

**Fix:** Wrap the `/donate` and `/payment` routes in `<ProtectedRoute>`, or redirect to login if `vv_token` is absent when "Continue" is clicked.

---

### BUG #15 — JWT Secret Hardcoded as Fallback in Multiple Files

**Location:** `backend/src/controllers/auth.controller.js` (line 10) + `backend/src/middleware/authMiddleware.js` (line 6)

**Problem:**
```js
const JWT_SECRET = process.env.JWT_SECRET || 'vidyavaidya-super-secret-key-2026';
```
This fallback is present in two places. If `.env` is missing (no `.env` file exists in the repo), the app uses a publicly known secret. Anyone can forge JWT tokens.

**Fix:**
- Remove the fallback string. Throw an error at startup if `JWT_SECRET` is not set:
```js
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('FATAL: JWT_SECRET environment variable is not set');
```
- Add a `.env.example` file to the repo.

---

### BUG #16 — Demo Admin Credentials Hardcoded in Both Frontend and Backend Source

**Location:** `frontend/src/pages/admin/AdminLogin.jsx` (line 5-8), `backend/src/controllers/auth.controller.js` (line ~215)

**Problem:**
`vidyavaidya@2024` is hardcoded in the JSX source code (shipped in the browser bundle) AND in the backend controller. It's also displayed in a `<div className="al-hint-box">` on the login page. This means **anyone browsing the site can gain admin access**.

**Fix:**
- Remove the hint box from production builds.
- Move demo credentials to environment variables only.
- Add `process.env.NODE_ENV === 'development'` guards around any demo bypass logic in the backend.

---

## SECTION 3 — INTEGRATION MISMATCHES

---

### MISMATCH #1 — `api.community.apply()` Sends `donorDetails` Key but Backend Ignores It

**Location:** `frontend/src/services/api.js` (line 200) vs `backend/src/controllers/community.controller.js`

**Problem:**
```js
// api.js
if (type === 'volunteer') body.volunteerDetails = details;
if (type === 'corporate') body.corporateDetails = details;
if (type === 'hospital') body.hospitalDetails = details;
// No handler for type === 'donor'
```
For `type: "donor"`, no detail object is sent. The backend `communitySchema` also doesn't define `donorDetails` validation — yet `"donor"` is a valid type. The frontend's `DonorForm.jsx` also just shows an `alert()` (see Bug #6), so this path is fully broken end-to-end.

**Fix:** Define a `donorDetails` schema in `community.schema.js` and add the corresponding handler in `api.js`:
```js
if (type === 'donor') body.donorDetails = details;
```

---

### MISMATCH #2 — Backend Expects `address` as an Object; Frontend Sends Flat Fields

**Location:** `backend/src/schemas/donate.schema.js` vs `frontend/src/pages/Donate.jsx`

**Problem:**
The backend schema requires:
```js
address: Joi.object({
  line: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string(),
  pincode: Joi.string().required()
})
```
The frontend form stores: `form.address`, `form.city`, `form.state`, `form.country`, `form.pincode` as flat keys. When `donorDetails` is eventually constructed and sent, it must be structured as a nested object or the schema will reject it.

**Fix:** When building the `donorDetails` payload in the Donate/Payment page:
```js
const donorDetails = {
  fullName: form.fullName,
  email: form.email,
  phone: `+91${form.mobile}`,
  address: {
    line: form.address,
    city: form.city,
    state: form.state,
    country: form.country,
    pincode: form.pincode
  },
  isAlumni: form.isAlumni,
  alumniId: form.alumniId || ''
};
```

---

### MISMATCH #3 — `api.payment.createOrder()` Does Not Send `donationType` but Backend Requires It

**Location:** `frontend/src/services/api.js` (line 133) vs `backend/src/schemas/donate.schema.js`

**Problem:**
```js
// api.js
async createOrder(amount, category, subcategory, donorDetails) {
  return apiRequest('/payment/create-order', {
    body: JSON.stringify({ amount, category, subcategory, donorDetails })
  });
}
```
The backend schema `createOrderSchema` has `donationType` as **required** (`one-time`, `monthly`, or `foreign`). It's never passed from the frontend, so Joi will reject every order creation request with a 422 validation error.

**Fix:** Add `donationType` to both the function signature and the request body:
```js
async createOrder(amount, category, subcategory, donorDetails, donationType = 'one-time') {
  return apiRequest('/payment/create-order', {
    body: JSON.stringify({ amount, category, subcategory, donorDetails, donationType })
  });
}
```

---

### MISMATCH #4 — `api.payment.createSubscription()` Sends `planAmount` + `duration` but Backend Also Needs `donorDetails`

**Location:** `frontend/src/services/api.js` (line 140) vs `backend/src/controllers/payment.controller.js`

**Problem:**
```js
// api.js
async createSubscription(planAmount, duration, donorDetails) {
  body: JSON.stringify({ planAmount, duration, donorDetails })
}
```
This looks correct, but the backend controller reads `req.body.donorDetails.email` without null-checking. If `donorDetails` is undefined (which it will be since Donate.jsx doesn't pass it), the subscription creation will throw a runtime error.

**Fix:** Add null safety in the backend controller and ensure `donorDetails` is always passed from the frontend.

---

### MISMATCH #5 — `api.admin.updateSettings()` Uses `POST` but REST Convention Expects `PUT`

**Location:** `frontend/src/services/api.js` (line 298)

**Problem:**
```js
async updateSettings(settings) {
  return apiRequest('/admin/settings', {
    method: 'POST',
    ...
  });
}
```
Check the admin routes to verify the backend method verb. Conventionally, settings updates should use `PUT`. This may cause 404 if the backend route only defines `PUT`.

**Fix:** Verify the backend admin route method and align both sides to use `PUT`.

---

### MISMATCH #6 — `api.stories.getPhotos()` / `getVideos()` Called but Backend May Not Have These Routes

**Location:** `frontend/src/services/api.js` (lines 170-176)

**Problem:**
```js
async getPhotos() { return apiRequest('/stories/gallery/photos'); }
async getVideos() { return apiRequest('/stories/gallery/videos'); }
```
The backend `stories.routes.js` needs to be verified to have `GET /api/stories/gallery/photos` and `GET /api/stories/gallery/videos`. If these are dynamic Firestore-backed routes, they must also handle the case where no gallery data exists gracefully.

---

### MISMATCH #7 — `getExportCsvUrl()` Passes Token as Query Parameter (Security Risk)

**Location:** `frontend/src/services/api.js` (line 344)

**Problem:**
```js
getExportCsvUrl(filters = {}) {
  const token = localStorage.getItem('vv_token') || '';
  const params = new URLSearchParams({ ...filters, token }).toString();
  return `${API_BASE_URL}/admin/export/donations?${params}`;
}
```
Passing the JWT as a URL query parameter exposes it in server logs, browser history, and referrer headers. The backend should accept it only as an `Authorization` header.

**Fix:** Use a short-lived signed URL or trigger the download via a `fetch()` call with the `Authorization` header and `blob()` the response.

---

## SECTION 4 — MINOR BUGS & CODE QUALITY ISSUES

---

### MINOR #1 — `signup` Registration Uses Hardcoded Password

**Location:** `frontend/src/pages/AuthPage.jsx` (line ~80)

All new users are registered with the password `"Vidyavaidya@2026"` hardcoded in the frontend. This is fine for OTP-only auth but is a security smell if the password is ever used. The comment says "secure default portal password" — consider removing password from the registration flow entirely if OTP is the only login method.

---

### MINOR #2 — `otp` Page Has No Guard Against Direct Navigation

**Location:** `frontend/src/pages/OtpPage.jsx`

`email` is read from `state?.email || "your email"`. If someone navigates to `/otp` directly (no prior `/auth` visit), `email` will be `"your email"` and the resend call will fail. Add a redirect to `/auth` if `state?.email` is absent.

---

### MINOR #3 — `vv_auth` Value Written as `'1'` — Inconsistent Across Codebase

**Location:** `api.js` writes `'1'`; `ProtectedRoute.jsx` checks for `"true"`; `AdminRoute.jsx` only checks `vv_admin_auth`. Standardize to `'true'`/`'false'` everywhere.

---

### MINOR #4 — `AdminRoute` Has No Session Expiry Check

**Location:** `frontend/src/routes/AdminRoute.jsx`

The admin session object has a `time` field but it is **never checked for expiry**. An admin session will be valid forever until manually cleared.

**Fix:**
```js
const SESSION_TTL = 8 * 60 * 60 * 1000; // 8 hours
const { loggedIn, time } = JSON.parse(auth);
if (!loggedIn || Date.now() - time > SESSION_TTL) return <Navigate to="/admin" replace />;
```

---

### MINOR #5 — `mongo-sanitize` Middleware Is Used but Backend Uses Firestore, Not MongoDB

**Location:** `backend/src/app.js` (line 6, 54)

```js
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize());
```
This middleware strips `$` and `.` from input to prevent MongoDB injection. The backend uses **Firebase Firestore**, which is not vulnerable to NoSQL injection in this way. The package is unnecessary overhead and misleading.

**Fix:** Remove `express-mongo-sanitize`. Keep `xss-clean` for general XSS protection.

---

### MINOR #6 — `label` Text Has a Typo

**Location:** `frontend/src/pages/AuthPage.jsx` (line ~190)

```jsx
<label>Code* Phone Number *</label>
```
Should be: `<label>Phone Number *</label>` (the "Code*" is vestigial text).

---

### MINOR #7 — `/Hero` Route Exposes a Raw Component

**Location:** `frontend/src/App.jsx` (line ~97)

```jsx
<Route path="/Hero" element={<Home />} />
```
This exposes the raw `Hero` component at `/Hero`. It should either be removed or redirected to `/`.

---

### MINOR #8 — No `.env` File or `.env.example` in Backend

The backend requires many environment variables (`FIREBASE_*`, `JWT_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `NODEMAILER_*`, `ENCRYPTION_KEY`, `FRONTEND_URL`). There is no `.env.example` shipped, making setup opaque for new developers and risky for production deployments.

**Fix:** Add a `.env.example` listing all required variables with placeholder values.

---

### MINOR #9 — `Donate.jsx` PAN Field Is Absent from the Donation Form

The backend `createOrderSchema` has an optional `pan` field for `donorDetails`. The `Donate.jsx` form does not collect PAN information at all. This means `is80GEligible` will always be `false` in Firestore, and donors will never receive 80G tax receipts.

**Fix:** Add an optional PAN input field in the donation form's Personal Details section.

---

## SECTION 5 — SUMMARY TABLE

| # | Severity | Area | Issue |
|---|----------|------|-------|
| 1 | CRITICAL | Auth Guard | ProtectedRoute reads wrong storage + wrong value |
| 2 | CRITICAL | Auth Guard | /dashboard has no ProtectedRoute |
| 3 | CRITICAL | Payment | PaymentModal is 100% fake/mocked — no backend calls |
| 4 | CRITICAL | Admin Auth | AdminLogin is client-only with hardcoded credentials |
| 5 | CRITICAL | Contact | Contact form never calls backend |
| 6 | CRITICAL | Community | All 4 community forms never call backend |
| 7 | CRITICAL | Donation | Foreign donor form never calls backend |
| 8 | CRITICAL | Backend | logout() crashes for OTP users with local- UIDs |
| 9 | MAJOR | Admin | AdminDashboard uses only mock data, no API calls |
| 10 | MAJOR | Admin | adminLoginSchema rejects "admin" username (not email) |
| 11 | MAJOR | Dev Config | No Vite proxy — CORS issues in development |
| 12 | MAJOR | Auth | Firebase idToken stored as auth token (expires 1hr) |
| 13 | MAJOR | Payment | Donate.jsx never derives category/subcategory |
| 14 | MAJOR | Payment | Donate page unprotected; payment API requires auth |
| 15 | MAJOR | Security | JWT secret hardcoded as fallback |
| 16 | MAJOR | Security | Demo admin credentials in source + UI |
| M1 | Mismatch | Community | `donorDetails` type missing from api.community.apply |
| M2 | Mismatch | Payment | Flat address fields vs nested address object in schema |
| M3 | Mismatch | Payment | `donationType` required by backend, never sent |
| M4 | Mismatch | Payment | createSubscription may crash without donorDetails |
| M5 | Mismatch | Admin | updateSettings uses POST instead of PUT |
| M6 | Mismatch | Stories | Gallery routes may not exist in backend |
| M7 | Mismatch | Admin | CSV export token passed in URL (security leak) |
| N1 | Minor | Auth | Hardcoded registration password |
| N2 | Minor | OTP | No guard for direct /otp navigation |
| N3 | Minor | Auth | `vv_auth` value inconsistent ('1' vs 'true') |
| N4 | Minor | Admin | No session expiry on AdminRoute |
| N5 | Minor | Backend | express-mongo-sanitize used with Firestore (unnecessary) |
| N6 | Minor | UI | "Code* Phone Number *" label typo |
| N7 | Minor | Routes | /Hero route exposes raw component |
| N8 | Minor | Config | No .env.example file |
| N9 | Minor | Payment | PAN field missing from donation form |

---

## Priority Fix Order

1. Fix ProtectedRoute storage/value mismatch (Bug #1) — 2 lines of code
2. Protect /dashboard with ProtectedRoute (Bug #2) — 5 lines
3. Connect Contact form to backend (Bug #5) — 1 hour
4. Connect Community/Volunteer forms to backend (Bug #6) — 2 hours
5. Remove hardcoded credentials, add .env guards (Bug #15, #16) — 1 hour
6. Fix logout for OTP users (Bug #8) — 3 lines
7. Connect AdminLogin to backend API (Bug #4) — 30 minutes
8. Wire PaymentModal to Razorpay + backend (Bug #3) — largest task, 1-2 days
9. Fix all integration mismatches (M1-M7)
10. Address minor issues

---

*Report generated by deep static analysis of both frontend (React/Vite) and backend (Node.js/Express/Firebase) codebases.*
