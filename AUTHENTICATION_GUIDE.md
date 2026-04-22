# Authentication & Security Implementation Guide

## Overview

Complete JWT-based authentication system has been integrated into the Student Management System with:
- **Password Hashing** (bcrypt)
- **JWT Tokens** for stateless authentication
- **Protected Routes** on backend and frontend
- **Role-based Access Control** (user/admin)

---

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Backend API    │────▶│   MongoDB       │
│  (React/Vite)   │     │  (Node/Express)  │     │   (Database)    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
         │                       │
         │  JWT Token           │  Password Hash
         │  (localStorage)      │  (bcrypt)
         ▼                       ▼
   ┌─────────────┐        ┌─────────────┐
   │  Auth       │        │  User Model │
   │  Context    │        │  (Mongoose) │
   └─────────────┘        └─────────────┘
```

---

## Backend Implementation

### 1. User Model (`models/user.model.js`)

**Features:**
- Name, email, password fields
- Email validation with regex
- Password minimum 6 characters
- Automatic password hashing using bcrypt
- `comparePassword()` method for login verification

**Security:**
```javascript
// Password hashing before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password never exposed in API responses
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};
```

### 2. Auth Controller (`controllers/auth.controller.js`)

**Endpoints:**
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout (client removes token)

**JWT Generation:**
```javascript
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};
```

### 3. Auth Middleware (`middlewares/auth.middleware.js`)

**Verifies:**
- Authorization header presence
- Bearer token format
- JWT signature validity
- Token expiration

**Attaches to request:**
```javascript
req.user = {
  userId: decoded.userId,
  email: decoded.email,
  role: decoded.role
};
```

### 4. Protected Routes (`app.js`)

All student routes now require authentication:
```javascript
app.use("/api/students", authMiddleware, studentRoutes);
```

---

## Frontend Implementation

### 1. Auth Context (`context/AuthContext.jsx`)

**Provides:**
- `user` - Current authenticated user
- `isAuthenticated` - Boolean auth state
- `login(email, password)` - Login function
- `signup(name, email, password)` - Signup function
- `logout()` - Logout function

**Token Storage:**
- JWT stored in `localStorage`
- Auto-loaded on page refresh
- Auto-cleared on logout or 401 errors

### 2. Auth Service (`services/authService.js`)

**Functions:**
- `signup(userData)` - Register new user
- `login(credentials)` - Authenticate user
- `logout()` - Clear auth data
- `getToken()` - Get stored JWT
- `isAuthenticated()` - Check auth status

### 3. API Integration (`utils/apiError.js`)

**Automatic token injection:**
```javascript
const fetchAPI = async (url, options = {}) => {
  const token = localStorage.getItem('auth_token');
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // ... fetch logic
};
```

### 4. Protected Routes (`App.jsx`)

**Route Structure:**
```jsx
{/* Public Routes */}
<Route path="/" element={<LandingPage />} />
<Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
<Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

{/* Protected Routes */}
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/add" element={<FormPage />} />
  <Route path="/edit/:id" element={<FormPage />} />
</Route>
```

### 5. Login & Signup Pages

**LoginPage (`pages/LoginPage.jsx`):**
- Email/password validation
- Error display
- Redirect to dashboard on success

**SignupPage (`pages/SignupPage.jsx`):**
- Name, email, password, confirm password
- Client-side validation
- Auto-login after signup

### 6. Navbar Updates

**Shows:**
- User name when authenticated
- Logout button
- Login button when not authenticated

---

## API Endpoints

### Authentication
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/signup` | No | Create new user |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/auth/me` | Yes | Get current user |
| POST | `/api/auth/logout` | Yes | Logout user |

### Students (All Protected)
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/students` | Yes | Get all students |
| POST | `/api/students` | Yes | Create student |
| GET | `/api/students/:id` | Yes | Get student |
| PUT | `/api/students/:id` | Yes | Update student |
| DELETE | `/api/students/:id` | Yes | Delete student |

---

## Security Features

### 1. Password Security
- **Hashing Algorithm:** bcrypt with 10 salt rounds
- **Plain text passwords:** NEVER stored
- **Comparison:** bcrypt.compare() for login

### 2. JWT Security
- **Signing:** HMAC SHA-256 (default)
- **Secret:** Environment variable (never exposed)
- **Expiration:** 7 days
- **Storage:** localStorage (browser)

### 3. Route Protection
- **Backend:** All student routes require valid JWT
- **Frontend:** Protected routes redirect to login if not authenticated
- **Public routes:** Redirect to dashboard if already logged in

### 4. CORS Configuration
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5176'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## Environment Variables

### Backend `.env`
```bash
MONGO_URI=mongodb+srv://...
PORT=3000
JWT_SECRET=your_super_secret_key_change_in_production
```

### Frontend `.env.local`
```bash
VITE_API_BASE_URL=http://localhost:3000
```

---

## Usage Flow

### 1. New User
1. Visit `/signup`
2. Enter name, email, password
3. Form submits to `POST /api/auth/signup`
4. Password hashed with bcrypt
5. JWT token generated and returned
6. Token stored in localStorage
7. Auto-redirect to dashboard

### 2. Existing User
1. Visit `/login`
2. Enter email, password
3. Form submits to `POST /api/auth/login`
4. Password compared with stored hash
5. JWT token generated and returned
6. Token stored in localStorage
7. Redirect to dashboard

### 3. Authenticated User
1. JWT auto-attached to all API requests
2. Access dashboard, add/edit/delete students
3. Navbar shows user name
4. Click logout → clear localStorage → redirect to login

---

## Testing

### Test Authentication Flow

```bash
# 1. Start backend
cd student-management
npm start

# 2. Start frontend (new terminal)
cd frontend
npm run dev

# 3. Open browser
http://localhost:5173

# 4. Test flow:
# - Create account at /signup
# - Login at /login
# - Access protected /dashboard
# - Add a student
# - Logout and try accessing /dashboard (should redirect)
```

---

## Common Issues & Fixes

### Issue 1: "Invalid credentials" on login
**Cause:** Wrong email or password
**Fix:** Check email case-sensitivity, verify password

### Issue 2: "Access denied. No token provided."
**Cause:** Not logged in or token expired
**Fix:** Login again, check localStorage has auth_token

### Issue 3: "Token expired"
**Cause:** JWT expired (after 7 days)
**Fix:** Login again to get new token

### Issue 4: CORS errors
**Cause:** Frontend and backend origins not matching
**Fix:** Update CORS origin in backend `app.js`

---

## Production Checklist

- [ ] Change `JWT_SECRET` to strong random string
- [ ] Use HTTPS for all communications
- [ ] Set shorter token expiration (1h + refresh)
- [ ] Implement token refresh mechanism
- [ ] Add rate limiting for login attempts
- [ ] Enable MongoDB authentication
- [ ] Use environment-specific CORS origins
- [ ] Add audit logging for auth events

---

## File Structure

```
backend/
├── models/
│   ├── user.model.js          # User schema with password hashing
│   └── student.model.js
├── controllers/
│   ├── auth.controller.js     # Signup, login, logout
│   └── student.controller.js
├── middlewares/
│   ├── auth.middleware.js     # JWT verification
│   └── ...
├── routes/
│   ├── auth.routes.js         # Auth endpoints
│   └── student.routes.js
└── .env                       # JWT_SECRET

frontend/
├── src/
│   ├── context/
│   │   └── AuthContext.jsx    # Auth state management
│   ├── services/
│   │   ├── authService.js     # Auth API calls
│   │   └── studentService.js
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   └── ...
│   ├── components/
│   │   └── Navbar.jsx         # Auth-aware navbar
│   ├── utils/
│   │   └── apiError.js        # Auth header injection
│   └── App.jsx                # Protected routes
└── .env.local                 # API base URL
```

---

## Security Best Practices Explained

### Why Password Hashing?
**Problem:** Database breaches expose passwords
**Solution:** bcrypt hashes passwords irreversibly
**Result:** Even with database access, passwords are unreadable

### Why JWT?
**Problem:** Session management is complex
**Solution:** Stateless tokens with embedded user info
**Result:** Scalable, no server-side session storage needed

### Why Protected Routes?
**Problem:** Unauthorized data access
**Solution:** Middleware checks token on every request
**Result:** Only authenticated users access data

### Why CORS?
**Problem:** Browser security blocks cross-origin requests
**Solution:** Server explicitly allows frontend origin
**Result:** Frontend and backend can communicate securely

---

## Summary

**Implemented:**
- ✅ User signup with password hashing
- ✅ User login with JWT generation
- ✅ Protected student routes (backend)
- ✅ Auth context with token management (frontend)
- ✅ Login & signup pages
- ✅ Protected routes with redirects
- ✅ Logout functionality
- ✅ Navbar with user info
- ✅ Auto token attachment to API calls
- ✅ Error handling for auth failures

**Security:**
- 🔒 Passwords never stored in plain text
- 🔒 JWT tokens with expiration
- 🔒 All student data protected
- 🔒 CORS configured for safe communication
- 🔒 Input validation on both sides

**Next Steps:**
1. Test the complete flow
2. Add password reset feature
3. Implement email verification
4. Add admin dashboard for user management
