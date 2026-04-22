require('dotenv').config();
const connectDB = require('./config/db');
const express = require("express");
const cors = require("cors");
const path = require('path');
const studentRoutes = require("./routes/student.routes");
const authRoutes = require("./routes/auth.routes");
const uploadRoutes = require("./routes/upload.routes");
const logger = require("./middlewares/logger.middleware");
const errorHandler = require("./middlewares/error.middleware");
const notFound = require("./middlewares/notFound.middleware");
const { authMiddleware } = require("./middlewares/auth.middleware");

const app = express();

connectDB();

// CORS Configuration
// Allow all origins in development (less secure but works for testing)
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(logger);

// Static files - serve uploaded images publicly
// WHY: Images saved to /public/uploads can be accessed via /uploads/filename
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Auth routes (public)
app.use("/api/auth", authRoutes);

// Protected student routes (authentication required)
app.use("/api/students", authMiddleware, studentRoutes);

// Protected upload routes (authentication handled in route file)
app.use("/api/upload", uploadRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;