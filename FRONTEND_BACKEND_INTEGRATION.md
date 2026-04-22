# Frontend-Backend API Integration Guide

## Overview

This document explains the complete integration between the React frontend and Node.js backend for the Student Management System.

## Architecture

### Backend (Node.js + Express + MongoDB)
- **Port**: 3000
- **Base URL**: `http://localhost:3000`
- **API Endpoints**: `/api/students/*`

### Frontend (React + Vite)
- **Port**: 5173 (or 5176 if 5173 is occupied)
- **API Base URL**: Configurable via environment variable

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | Get all students |
| GET | `/api/students/:id` | Get single student |
| POST | `/api/students` | Create new student |
| PUT | `/api/students/:id` | Update existing student |
| DELETE | `/api/students/:id` | Delete student |

## Frontend Integration Layer

### 1. API Configuration (`src/utils/api.config.js`)
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export const API_ENDPOINTS = {
  students: {
    getAll: `${API_BASE_URL}/api/students`,
    getById: (id) => `${API_BASE_URL}/api/students/${id}`,
    create: `${API_BASE_URL}/api/students`,
    update: (id) => `${API_BASE_URL}/api/students/${id}`,
    delete: (id) => `${API_BASE_URL}/api/students/${id}`,
  }
}
```

### 2. Service Layer (`src/services/studentService.js`)
Complete API service with:
- Error handling
- Request validation
- Consistent response format
- Search functionality

### 3. Custom Hook (`src/hooks/useStudents.js`)
React hook that provides:
- State management (students, loading, error)
- CRUD operations
- Search functionality
- Refetch capability

## Environment Variables

### Frontend `.env.local`
```bash
VITE_API_BASE_URL=http://localhost:3000
```

### Backend CORS Configuration
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5176', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Error Handling

### Frontend Error Types
1. **Network Errors**: Connection issues, server down
2. **Validation Errors**: Invalid data format
3. **Not Found Errors**: Resource doesn't exist
4. **Server Errors**: Backend issues (500, 503)

### Error Messages
- User-friendly error messages
- Retry functionality where applicable
- Loading states during API calls

## Data Flow

### 1. Fetch Students
```
DashboardPage -> useStudents -> studentService.getStudents() -> Backend API
```

### 2. Create Student
```
FormPage -> useStudents.addStudent() -> studentService.createStudent() -> Backend API
```

### 3. Update Student
```
FormPage -> useStudents.updateStudent() -> studentService.updateStudent() -> Backend API
```

### 4. Delete Student
```
DashboardPage -> useStudents.deleteStudent() -> studentService.deleteStudent() -> Backend API
```

## Running the Application

### 1. Start Backend
```bash
cd student-management
npm install
npm start
# Backend runs on http://localhost:3000
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173 (or next available port)
```

## Common Issues and Solutions

### 1. CORS Errors
**Problem**: "Access to fetch at 'http://localhost:3000' has been blocked by CORS policy"

**Solution**: Ensure CORS is configured in backend with correct origins

### 2. Connection Refused
**Problem**: "Failed to fetch" or "Network error"

**Solution**: 
- Verify backend is running on correct port
- Check API_BASE_URL environment variable
- Ensure no firewall blocking the connection

### 3. 404 Errors
**Problem**: API endpoints return 404

**Solution**:
- Verify endpoint URLs in `api.config.js`
- Check backend routes configuration
- Ensure API base path is correct (`/api/students`)

### 4. Validation Errors
**Problem**: 400 Bad Request

**Solution**:
- Check request body format
- Ensure required fields are included
- Verify data types match backend expectations

## Best Practices Implemented

### 1. Separation of Concerns
- **Services**: API calls only
- **Hooks**: State management and business logic
- **Components**: UI rendering only

### 2. Error Handling
- Centralized error handling in `apiError.js`
- User-friendly error messages
- Retry functionality where appropriate

### 3. Loading States
- Loading spinners during API calls
- Disabled buttons during operations
- Skeleton states for better UX

### 4. Environment Configuration
- Environment variables for different environments
- Default fallbacks for development
- Easy production deployment

## Testing the Integration

### 1. Manual Testing
1. Navigate to `http://localhost:5176`
2. Add a new student
3. Edit existing student
4. Delete a student
5. Search functionality

### 2. API Testing
Use tools like Postman or curl to test endpoints directly:

```bash
# Get all students
curl http://localhost:3000/api/students

# Create student
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","age":25,"course":"Computer Science"}'
```

## Production Deployment

### 1. Environment Variables
```bash
# Production
VITE_API_BASE_URL=https://your-backend-domain.com
```

### 2. CORS Update
Update backend CORS to include production domain:
```javascript
origin: ['https://your-frontend-domain.com', 'http://localhost:5173']
```

### 3. Security Considerations
- Use HTTPS in production
- Implement authentication if needed
- Validate all inputs on backend
- Rate limiting for API endpoints

## File Structure

```
frontend/
src/
  services/
    studentService.js          # API service layer
  hooks/
    useStudents.js             # React hook for state management
  utils/
    api.config.js             # API configuration
    apiError.js               # Error handling utilities
  pages/
    DashboardPage.jsx         # Main dashboard
    FormPage.jsx              # Add/Edit form
```

## Summary

The frontend-backend integration is complete with:
- **Real API integration** replacing dummy data
- **Clean architecture** with separation of concerns
- **Comprehensive error handling** with user-friendly messages
- **Loading states** for better UX
- **Environment configuration** for different environments
- **CORS configuration** for cross-origin requests
- **Production-ready** code structure

The system is now fully functional with real backend API integration!
