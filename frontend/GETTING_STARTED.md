# 🚀 Getting Started Guide

## Step 1: Prerequisites

Make sure you have installed:

- **Node.js** 16+ ([Download](https://nodejs.org))
- **npm** (comes with Node.js)
- **Git** (optional, for version control)

Verify installation:

```bash
node --version
npm --version
```

---

## Step 2: Project Setup

Navigate to the frontend folder:

```bash
cd frontend
```

Install all dependencies:

```bash
npm install
```

This downloads all packages listed in `package.json`:

- `react` - UI library
- `react-dom` - React for web
- `react-router-dom` - Client-side routing
- `vite` - Build tool
- `tailwindcss` - CSS framework
- And more...

---

## Step 3: Run Development Server

Start the development server:

```bash
npm run dev
```

You should see:

```
  VITE v5.0.8  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

The app will automatically open in your browser at `http://localhost:5173`

---

## Step 4: Explore the App

### Landing Page (`/`)

- Click "Get Started" button
- Scroll through features section
- Learn about the tech stack

### Dashboard (`/dashboard`)

- See all students in card view
- Click view toggle to switch to table view
- Use search to filter students
- Try Edit and Delete buttons

### Add Student (`/add`)

- Fill in the form
- Try submitting with empty fields (validation!)
- Add a new student
- Gets added to the list instantly

### Edit Student (`/edit/:id`)

- Click Edit on any student
- Form pre-fills with existing data
- Make changes and save
- Returns to dashboard

---

## Step 5: Explore the Code

### Component Tour

1. **Start Here**: `src/App.jsx`
   - Main routing setup
   - Shows all routes

2. **Pages**: `src/pages/`
   - `LandingPage.jsx` - Home page
   - `DashboardPage.jsx` - Student list
   - `FormPage.jsx` - Add/Edit form

3. **Components**: `src/components/`
   - `Button.jsx` - Reusable button
   - `Navbar.jsx` - Navigation
   - `StudentCard.jsx` - Student card view
   - `StudentTable.jsx` - Student table view
   - `StudentForm.jsx` - Form for add/edit

4. **Hooks**: `src/hooks/useStudents.js`
   - All data fetching logic
   - State management

5. **Services**: `src/services/studentService.js`
   - Mock API calls
   - Simulates backend

6. **Data**: `src/data/mockData.js`
   - Dummy student data
   - Used to populate app

---

## Step 6: Make Your First Change

### Change the App Title

1. Open `src/components/Navbar.jsx`
2. Find this line:
   ```jsx
   <h1 className="text-2xl font-bold text-primary-600">📚 StudentHub</h1>
   ```
3. Change "StudentHub" to something else, like "🎓 LearnHub"
4. Save the file (Ctrl+S)
5. Check the browser - it updates instantly! (Hot Module Replacement - HMR)

### Add a New Feature

Try adding a loading state indicator:

1. Open `src/pages/DashboardPage.jsx`
2. Find the heading
3. Add after `<h1>`:
   ```jsx
   {
     loading && <p className="text-yellow-600">Loading students...</p>;
   }
   ```
4. Save and see the message appear while students load

---

## Step 7: Understanding the Mock Data

When you add/edit/delete students:

- Data is stored in memory (in `useStudents` hook)
- Lasts only while the dev server is running
- Refreshing the page resets to original data
- This is intentional for learning purposes

**Why?** You'll replace this with real backend API later.

---

## Step 8: Build for Production

When ready to deploy:

```bash
npm run build
```

This creates an optimized `dist/` folder:

- Minified JavaScript
- Optimized CSS
- Ready to upload to a server

Preview production build:

```bash
npm run preview
```

---

## Step 9: Environment Variables

Create `.env.local` file in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:3000
```

Use in code:

```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## File Structure Reference

```
frontend/
├── src/
│   ├── App.jsx                 ← Main app & routing
│   ├── main.jsx                ← Entry point
│   ├── index.css               ← Global styles
│   │
│   ├── pages/                  ← Full page components
│   │   ├── LandingPage.jsx
│   │   ├── DashboardPage.jsx
│   │   └── FormPage.jsx
│   │
│   ├── components/             ← Reusable components
│   │   ├── Button.jsx
│   │   ├── Navbar.jsx
│   │   ├── StudentCard.jsx
│   │   ├── StudentTable.jsx
│   │   ├── StudentForm.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── EmptyState.jsx
│   │   └── SearchBar.jsx
│   │
│   ├── hooks/                  ← Custom React hooks
│   │   └── useStudents.js
│   │
│   ├── services/               ← API layer
│   │   └── studentService.js
│   │
│   ├── utils/                  ← Helper functions
│   │   ├── helpers.js
│   │   └── api.config.js
│   │
│   └── data/                   ← Constants
│       └── mockData.js
│
├── index.html                  ← HTML template
├── package.json                ← Dependencies
├── vite.config.js              ← Vite configuration
├── tailwind.config.js          ← Tailwind configuration
├── postcss.config.js           ← PostCSS configuration
└── README.md                   ← Documentation
```

---

## Common Tasks

### Task 1: Add a New Button Style

1. Open `src/index.css`
2. Find `@layer components` section
3. Add:
   ```css
   .btn-success {
     @apply px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium;
   }
   ```
4. Use in component:
   ```jsx
   <Button variant="success">Save</Button>
   ```

### Task 2: Change Colors

1. Open `tailwind.config.js`
2. Modify the color palette:
   ```javascript
   colors: {
     primary: {
       600: '#1e40af',  // Change to your color
     }
   }
   ```
3. All primary-colored elements update automatically!

### Task 3: Add a New Page

1. Create `src/pages/MyPage.jsx`:
   ```jsx
   export function MyPage() {
     return <div>My New Page</div>;
   }
   ```
2. Add route in `src/App.jsx`:
   ```jsx
   <Route path="/mypage" element={<MyPage />} />
   ```
3. Visit `http://localhost:5173/mypage`

### Task 4: Add a New Student Field

1. Update `src/data/mockData.js`:
   ```javascript
   { id: '1', name: 'Alice', age: 20, course: '...', email: 'alice@example.com' }
   ```
2. Update `src/components/StudentForm.jsx`:
   ```jsx
   <input type="email" name="email" ... />
   ```
3. Update `StudentCard.jsx` and `StudentTable.jsx` to show new field

---

## Debugging Tips

### Hot Module Replacement (HMR) Not Working?

```bash
# Restart dev server
npm run dev

# Or kill and restart
Ctrl+C
npm run dev
```

### Dependencies Not Installing?

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules

# Reinstall
npm install
```

### Port 5173 Already in Use?

```bash
# Change port in vite.config.js
server: {
  port: 5174,  // Change to 5174
}
```

### Console Errors?

1. Open browser DevTools: `F12`
2. Check Console tab for error messages
3. Read error message carefully (usually tells you what's wrong!)

---

## Useful VS Code Extensions

Install these for better development experience:

1. **ES7+ React/Redux/React-Native snippets**
   - Quick React code snippets

2. **Tailwind CSS IntelliSense**
   - Autocomplete for Tailwind classes

3. **Prettier - Code Formatter**
   - Auto-format code on save

4. **Live Server** (optional)
   - View changes in real-time

---

## Next Steps

1. ✅ Get the app running
2. ✅ Explore all pages
3. ✅ Make small changes
4. ✅ Read the code comments
5. ✅ Try adding new features
6. ✅ Study the React concepts (see CONCEPTS.md)
7. ✅ Understand the architecture (see ARCHITECTURE.md)
8. 🔜 Connect to backend API
9. 🔜 Deploy to production

---

## Need Help?

### Read the Documentation

- `README.md` - Project overview
- `ARCHITECTURE.md` - Design patterns explained
- `CONCEPTS.md` - React concepts explained
- Code comments in each file

### Console Errors?

Check browser DevTools (F12):

1. Console tab - Shows errors
2. Network tab - Shows API calls
3. Elements tab - Shows HTML structure

### Still Stuck?

1. Check the error message carefully
2. Search error in Google
3. Check React documentation
4. Review the related code file

---

**You're all set! Happy coding! 🚀**
