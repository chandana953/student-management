# 🔧 Backend Setup - CORS Configuration

Copy-paste ready code to add CORS support to your Node.js + Express backend.

---

## 📦 Step 1: Install CORS

```bash
npm install cors
```

---

## 📝 Step 2: Update Your Server File

### Option A: Complete Example (If starting fresh)

**`server.js` or `app.js`:**

```javascript
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ==================== CORS Configuration ====================
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// ===========================================================

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/students_db")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Routes
app.use("/api/students", require("./routes/student.routes"));

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message,
    status: err.status || 500,
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(
    `✅ CORS enabled for: ${process.env.FRONTEND_URL || "http://localhost:5173"}`,
  );
});
```

---

### Option B: Just Add CORS to Existing Server

If you already have a server, add these lines:

```javascript
const cors = require("cors");
const express = require("express");

const app = express();

// ADD THIS BLOCK
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
// END OF BLOCK

// Rest of your code...
```

---

## 🔐 Step 3: Add Environment Variables

Create `.env` file in backend root:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/students_db

# CORS - Frontend URL
FRONTEND_URL=http://localhost:5173
```

---

## ✅ Verify It Works

### Test 1: Check CORS Headers

```bash
# From frontend terminal (or any terminal)
curl -i http://localhost:5000/api/students
```

Look for these headers in response:

```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
```

### Test 2: Make API Request from Browser

Open browser console (F12) and run:

```javascript
fetch("http://localhost:5000/api/students")
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
```

Should return students array without CORS error.

---

## 🚀 REST API Endpoints (Expected)

Your backend should expose these endpoints:

```
GET    /api/students           - Get all students
POST   /api/students           - Create new student
GET    /api/students/:id       - Get single student
PUT    /api/students/:id       - Update student
DELETE /api/students/:id       - Delete student
```

---

## 📊 Example Controller (Student Controller)

```javascript
// controllers/student.controller.js
const Student = require("../models/student.model");

// GET all students
exports.getStudents = async (req, res, next) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    next(err);
  }
};

// GET single student
exports.getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    next(err);
  }
};

// POST create student
exports.createStudent = async (req, res, next) => {
  try {
    const { name, age, course } = req.body;

    // Validate
    if (!name || !age || !course) {
      return res.status(400).json({
        message: "Name, age, and course are required",
      });
    }

    const student = new Student({ name, age, course });
    await student.save();

    res.status(201).json(student);
  } catch (err) {
    next(err);
  }
};

// PUT update student
exports.updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    next(err);
  }
};

// DELETE student
exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    next(err);
  }
};
```

---

## 📋 Example Routes

```javascript
// routes/student.routes.js
const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student.controller");

router.get("/", studentController.getStudents);
router.post("/", studentController.createStudent);
router.get("/:id", studentController.getStudentById);
router.put("/:id", studentController.updateStudent);
router.delete("/:id", studentController.deleteStudent);

module.exports = router;
```

---

## ✅ Checklist

- [ ] Installed `cors` package
- [ ] Added CORS middleware to server
- [ ] Added `.env` file with `FRONTEND_URL`
- [ ] Backend runs on port 5000
- [ ] MongoDB connected
- [ ] All endpoints working (GET, POST, PUT, DELETE)
- [ ] CORS headers present in responses
- [ ] Frontend can make requests without errors

---

## 🔄 Complete Server Structure

```
backend/
├── server.js              ← Main server file with CORS
├── .env                   ← Environment variables
├── models/
│   └── student.model.js   ← MongoDB schema
├── controllers/
│   └── student.controller.js  ← Route handlers
├── routes/
│   └── student.routes.js  ← Route definitions
├── middlewares/           ← Custom middleware
├── config/                ← Configuration files
└── package.json           ← Dependencies
```

---

## 🚀 Start Backend

```bash
# Terminal 1: Start Backend
npm run dev

# Should see:
# ✅ MongoDB connected
# ✅ Server running on http://localhost:5000
# ✅ CORS enabled for: http://localhost:5173
```

---

## 🐛 Troubleshooting

### Issue: CORS Error Still Appearing

**Solution:**

1. Check `FRONTEND_URL` in `.env`
2. Restart backend server
3. Clear browser cache
4. Check browser console for exact error message

### Issue: 404 Endpoint Not Found

**Solution:**

1. Check route path is correct
2. Check controller is handling request
3. Verify route is registered in server.js
4. Use `app.use('/api/students', routes)`

### Issue: MongoDB Connection Failed

**Solution:**

1. Ensure MongoDB is running
2. Check `MONGODB_URI` in `.env`
3. Check connection string format
4. Verify credentials if using MongoDB Atlas

---

## 📝 Environment Variables Reference

```env
# Required
PORT=5000
MONGODB_URI=mongodb://localhost:27017/students_db
FRONTEND_URL=http://localhost:5173

# Optional
NODE_ENV=development
API_VERSION=v1
LOG_LEVEL=debug
```

---

## ✨ Now Your Backend is Ready!

✅ CORS configured  
✅ Accepts requests from frontend  
✅ Returns proper headers  
✅ All endpoints working

**Frontend can now connect to backend!** 🎉

---

## 🔗 Next: Frontend Setup

After backend is running, the frontend will:

1. Read API URL from `.env.local`
2. Make fetch requests to backend
3. Receive data from MongoDB
4. Update UI with real data

See `BACKEND_INTEGRATION.md` in frontend folder for complete integration guide.
