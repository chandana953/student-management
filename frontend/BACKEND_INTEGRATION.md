# 🔗 Frontend-Backend Integration Guide

Complete guide to connecting your React frontend with Node.js backend.

---

## ✅ Prerequisites

You need:

1. **Backend** running on `http://localhost:5000`
2. **Frontend** running on `http://localhost:5173`
3. **MongoDB** connected and working
4. **Backend REST API endpoints** (GET, POST, PUT, DELETE /students)

---

## 📋 Step-by-Step Integration

### Step 1: Update Backend with CORS

Your backend needs to allow frontend requests from different origin.

#### In your backend folder, install CORS:

```bash
npm install cors
```

#### In your backend `server.js` or `app.js`:

```javascript
const cors = require("cors");
const express = require("express");

const app = express();

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Routes
app.use("/api/students", studentRoutes);

// Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

**Or use environment variables for better security:**

```javascript
// .env file
FRONTEND_URL=http://localhost:5173
PORT=5000
MONGODB_URI=mongodb://localhost:27017/students_db
```

---

### Step 2: Update Frontend Environment

Create `.env.local` file in frontend root:

```
VITE_API_BASE_URL=http://localhost:5000
```

**Verify it's loaded:**

```javascript
// In any component
console.log(import.meta.env.VITE_API_BASE_URL);
// Output: http://localhost:5000
```

---

### Step 3: Install Dependencies (Frontend)

```bash
cd frontend
npm install
```

**Dependencies already included:**

- ✅ react
- ✅ react-router-dom
- ✅ vite
- ✅ tailwindcss

---

### Step 4: Start Both Servers

**Terminal 1 - Backend:**

```bash
cd ../  # Go to backend folder
npm run dev
# Backend running on http://localhost:5000
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
# Frontend running on http://localhost:5173
```

---

## 🔄 How Data Flows

### Get All Students

```
User opens Dashboard
    ↓
DashboardPage mounts
    ↓
useStudents() hook runs
    ↓
useEffect triggers
    ↓
studentService.getStudents()
    ↓
fetch('http://localhost:5000/api/students')
    ↓
Backend returns students array
    ↓
setStudents(data)
    ↓
Component re-renders with data
```

### Add New Student

```
User fills form and clicks Submit
    ↓
handleSubmit() called
    ↓
addStudent(formData) called
    ↓
studentService.createStudent(formData)
    ↓
fetch POST to /api/students with JSON body
    ↓
Backend creates student in MongoDB
    ↓
Returns created student with _id
    ↓
Frontend updates local state
    ↓
Navigates back to dashboard
```

### Edit Student

```
User clicks Edit button
    ↓
Navigates to /edit/:id
    ↓
FormPage loads
    ↓
useEffect fetches student by ID
    ↓
studentService.getStudentById(id)
    ↓
fetch GET /api/students/:id
    ↓
Form pre-fills with data
    ↓
User updates form and submits
    ↓
updateStudent(id, formData)
    ↓
fetch PUT /api/students/:id with JSON body
    ↓
Backend updates in MongoDB
    ↓
Returns updated student
    ↓
Frontend navigates to dashboard
```

### Delete Student

```
User clicks Delete button
    ↓
Confirmation dialog
    ↓
deleteStudent(id) called
    ↓
studentService.deleteStudent(id)
    ↓
fetch DELETE /api/students/:id
    ↓
Backend deletes from MongoDB
    ↓
Frontend removes from state
    ↓
UI updates instantly
```

---

## 🚀 API Endpoints (Backend Expected)

Your backend should have these endpoints:

### GET /api/students

**Response:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Alice Johnson",
    "age": 20,
    "course": "Computer Science"
  },
  ...
]
```

### GET /api/students/:id

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Alice Johnson",
  "age": 20,
  "course": "Computer Science"
}
```

### POST /api/students

**Request:**

```json
{
  "name": "Bob Smith",
  "age": 22,
  "course": "Information Technology"
}
```

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Bob Smith",
  "age": 22,
  "course": "Information Technology"
}
```

### PUT /api/students/:id

**Request:**

```json
{
  "name": "Bob Updated",
  "age": 23
}
```

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Bob Updated",
  "age": 23,
  "course": "Information Technology"
}
```

### DELETE /api/students/:id

**Response:**

```json
{
  "message": "Student deleted successfully"
}
```

---

## 🛠️ Frontend File Structure (Updated)

```
frontend/
├── src/
│   ├── services/
│   │   └── studentService.js       ⭐ REAL API calls (fetch)
│   │
│   ├── utils/
│   │   ├── api.config.js           ← API endpoints config
│   │   ├── apiError.js             ← Error handling
│   │   └── ...
│   │
│   ├── hooks/
│   │   └── useStudents.js          ← Data management
│   │
│   ├── pages/
│   │   ├── DashboardPage.jsx       ← Fetch all students
│   │   └── FormPage.jsx            ← Add/Edit students
│   │
│   └── ...
│
├── .env.local                       ← Backend URL
└── ...
```

---

## 🔍 Key Files to Understand

### 1. **studentService.js** - Real API Layer

```javascript
// Uses fetch API to call backend
export const studentService = {
  async getStudents() {
    const data = await fetchAPI(API_ENDPOINTS.students.getAll);
    return data;
  },

  async createStudent(studentData) {
    const data = await fetchAPI(API_ENDPOINTS.students.create, {
      method: "POST",
      body: JSON.stringify(studentData),
    });
    return data;
  },
  // ... more methods
};
```

### 2. **apiError.js** - Error Handling

```javascript
// Centralized error handling
export async function fetchAPI(url, options = {}) {
  try {
    const response = await fetch(url, options)
    if (!response.ok) {
      await handleAPIError(response)
    }
    return await response.json()
  } catch (error) {
    // Handle network errors, JSON errors, etc
    throw new APIError(...)
  }
}
```

### 3. **useStudents.js** - State Management

```javascript
// Manages student data from API
export function useStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents(); // Fetch from API on mount
  }, []);

  // ... CRUD operations
}
```

---

## ⚠️ Common Errors & Fixes

### Error 1: CORS Error

```
Access to XMLHttpRequest at 'http://localhost:5000/api/students'
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Fix:** Install CORS in backend and configure it:

```javascript
npm install cors
app.use(cors())
```

---

### Error 2: 404 Not Found

```
Failed to fetch students. Please check your connection and try again.
HTTP Error 404
```

**Fix:**

1. Check backend is running on correct port
2. Verify endpoint path: `/api/students`
3. Check `.env.local` has correct `VITE_API_BASE_URL`

---

### Error 3: Network Error

```
Network error. Please check your connection and try again.
```

**Possible Causes:**

- Backend not running
- Wrong backend URL in `.env.local`
- Firewall blocking connection
- Wrong port number

**Fix:**

```bash
# Check backend is running
curl http://localhost:5000/api/students

# Update .env.local
VITE_API_BASE_URL=http://localhost:5000

# Restart frontend
npm run dev
```

---

### Error 4: Validation Error

```
Invalid data. Please check your input.
HTTP Error 400
```

**Fix:** Check form validation in `StudentForm.jsx`. Ensure:

- Name is not empty and 2+ characters
- Age is between 15-80
- Course is selected

---

### Error 5: MongoDB ObjectId Error

```
Cast to ObjectId failed for value "123"
```

**Fix:** Your backend is receiving invalid ID format. Ensure:

- Frontend sends correct MongoDB ObjectId
- Backend validates IDs properly

---

## 🧪 Testing the Integration

### Test 1: Can Frontend Reach Backend?

```bash
# In browser console (Frontend running on :5173)
fetch('http://localhost:5000/api/students')
  .then(r => r.json())
  .then(d => console.log(d))
```

Should log student array.

### Test 2: Does Form Submit Work?

1. Go to http://localhost:5173/add
2. Fill form with:
   - Name: "Test Student"
   - Age: 25
   - Course: "Computer Science"
3. Click "Add Student"
4. Should redirect to dashboard
5. New student should appear in list

### Test 3: Does Delete Work?

1. Go to dashboard
2. Click Delete on any student
3. Confirm deletion
4. Student should disappear from list

### Test 4: Does Edit Work?

1. Go to dashboard
2. Click Edit on any student
3. Form should pre-fill
4. Change name
5. Click "Update Student"
6. Dashboard should show updated name

---

## 📊 Environment Variables

### Frontend (.env.local)

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:5000

# Optional: API timeout (milliseconds)
VITE_API_TIMEOUT=30000
```

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/students_db

# CORS
FRONTEND_URL=http://localhost:5173

# Optional: API
API_VERSION=v1
```

---

## 🔐 Security Considerations

### Current Implementation (Development)

✅ CORS allows requests from specific origin
✅ Content-Type header set to application/json
✅ Error messages don't expose sensitive info
✅ Client-side validation before API call

### For Production

⚠️ Add these:

- ✅ HTTPS only (not HTTP)
- ✅ API authentication (JWT tokens)
- ✅ Rate limiting
- ✅ Input sanitization on backend
- ✅ Database query optimization
- ✅ Error logging
- ✅ API key management

---

## 📈 Next Steps

1. ✅ Install CORS in backend
2. ✅ Update backend to allow `http://localhost:5173`
3. ✅ Update frontend `.env.local` with backend URL
4. ✅ Start both servers
5. ✅ Test all CRUD operations
6. ✅ Check browser console for errors
7. ✅ Deploy when ready

---

## 🆘 Troubleshooting Checklist

- [ ] Backend running on http://localhost:5000?
- [ ] Frontend running on http://localhost:5173?
- [ ] CORS installed in backend?
- [ ] Backend CORS config allows frontend origin?
- [ ] MongoDB running and connected?
- [ ] .env.local has correct API URL?
- [ ] No TypeErrors in browser console?
- [ ] Network tab shows requests to backend?
- [ ] Backend responses have correct format?

---

## 📝 Code Examples

### Making an API Call

```javascript
import { studentService } from "../services/studentService";

// In component or hook
const students = await studentService.getStudents();
// Returns: [{ _id: '...', name: '...', age: 20, course: '...' }]
```

### Error Handling

```javascript
try {
  const student = await studentService.getStudentById(id);
} catch (error) {
  if (error.status === 404) {
    console.log("Student not found");
  } else if (error.status === 0) {
    console.log("Network error");
  } else {
    console.log("Server error:", error.message);
  }
}
```

### Using the Hook

```javascript
function MyComponent() {
  const { students, loading, error, addStudent } = useStudents();

  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;

  return (
    <div>
      {students.map((s) => (
        <StudentCard key={s._id} student={s} />
      ))}
    </div>
  );
}
```

---

## ✨ Summary

✅ Backend configured with CORS  
✅ Frontend configured with API URL  
✅ Service layer handles API calls  
✅ Error handling for network issues  
✅ Loading states for better UX  
✅ Real data from MongoDB  
✅ Full CRUD operations working  
✅ Production-ready integration

**Now your frontend is fully connected to your backend!** 🎉
