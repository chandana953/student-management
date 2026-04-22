# ⚛️ React Concepts Explained

A comprehensive guide to all React concepts used in this Student Management System frontend.

---

## Table of Contents

1. [useState - State Management](#1-usestate---state-management)
2. [useEffect - Side Effects](#2-useeffect---side-effects)
3. [Custom Hooks](#3-custom-hooks)
4. [Virtual DOM](#4-virtual-dom)
5. [Closures in React](#5-closures-in-react)
6. [Props & Component Reusability](#6-props--component-reusability)
7. [Conditional Rendering](#7-conditional-rendering)
8. [Event Handling](#8-event-handling)
9. [Component Lifecycle](#9-component-lifecycle)
10. [Key Prop](#10-key-prop)

---

## 1. useState - State Management

### What is State?

State is data that changes over time and affects how the component renders.

```javascript
// Without state (static)
function StaticCounter() {
  return <p>Count: 0</p>; // Always shows 0
}

// With state (dynamic)
function DynamicCounter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### How useState Works

```javascript
const [state, setState] = useState(initialValue);
```

- **First element** (`state`) - Current value
- **Second element** (`setState`) - Function to update value
- **Argument** - Initial value

### Example from Project

**DashboardPage.jsx**:

```javascript
const [viewType, setViewType] = useState('card')

// User clicks button
<button onClick={() => setViewType('table')}>
  📋 Table View
</button>

// viewType changes from 'card' to 'table'
// Component re-renders with new view
```

### Multiple useState Calls

```javascript
function StudentForm() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [course, setCourse] = useState("Computer Science");

  return (
    <form>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={age} onChange={(e) => setAge(e.target.value)} />
      <select value={course} onChange={(e) => setCourse(e.target.value)}>
        {/* options */}
      </select>
    </form>
  );
}
```

### Rules of useState

✅ **Do This**:

```javascript
// Call at top level
function Component() {
  const [value, setValue] = useState(0); // ✅ Top level
  return <div>{value}</div>;
}
```

❌ **Don't Do This**:

```javascript
function Component() {
  if (condition) {
    const [value, setValue] = useState(0); // ❌ Inside condition
  }
}

// Or inside a loop
function Component() {
  for (let i = 0; i < 5; i++) {
    const [value, setValue] = useState(0); // ❌ Inside loop
  }
}
```

**Why?** React relies on call order to track state.

### State Updates Are Asynchronous

```javascript
function Example() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
    console.log(count); // Still shows old value!
    // This is because setState is async
  };

  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

### Functional Updates

```javascript
// Better way when depending on previous value
const increment = () => {
  setCount((prevCount) => prevCount + 1); // Previous value
};

// Good for multiple updates
const incrementTwice = () => {
  setCount((prev) => prev + 1);
  setCount((prev) => prev + 1); // Both work correctly
};
```

---

## 2. useEffect - Side Effects

### What are Side Effects?

Side effects are things that happen **outside** the component:

- Fetching data from API
- Setting timers
- Manual DOM manipulation
- Storing data in localStorage

### Basic useEffect

```javascript
useEffect(() => {
  // Code here runs after component renders
  console.log("Component mounted!");

  return () => {
    // Cleanup function - runs before component unmounts
    console.log("Component unmounting!");
  };
}, []); // Dependency array - when to run this effect
```

### Three Patterns

#### Pattern 1: Run on Every Render (No Dependency Array)

```javascript
useEffect(() => {
  console.log("Runs after EVERY render");
});
```

**⚠️ Warning**: Usually causes infinite loops!

#### Pattern 2: Run Once on Mount (Empty Dependency Array)

```javascript
useEffect(() => {
  console.log("Runs ONCE when component mounts");
  fetchStudents();
}, []); // Empty array = run once
```

**Common Use Case**: Loading initial data

#### Pattern 3: Run When Dependencies Change

```javascript
useEffect(() => {
  console.log("Runs when id changes");
  fetchStudentById(id);
}, [id]); // Run when id changes
```

**Common Use Case**: Fetch data when URL parameter changes

### Example from Project

**useStudents Hook**:

```javascript
export function useStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch on component mount
  useEffect(() => {
    fetchStudents();
  }, []); // Empty array = run once

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentService.getStudents();
      setStudents(data);
    } catch (err) {
      setError("Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  return { students, loading, error };
}
```

### Cleanup Function

Used to prevent memory leaks:

```javascript
useEffect(() => {
  const timer = setTimeout(() => {
    console.log("3 seconds later");
  }, 3000);

  return () => {
    clearTimeout(timer); // Cleanup: clear timer
  };
}, []);

// Without cleanup, timer still runs even if component unmounts!
```

### Dependency Array

Controls when effect runs:

```javascript
// No dependency array - runs on every render
useEffect(() => {
  /* ... */
});

// Empty dependency array - runs once
useEffect(() => {
  /* ... */
}, []);

// With dependencies - runs when dependencies change
useEffect(() => {
  /* ... */
}, [studentId, searchQuery]);

// DON'T include everything
// Only include values the effect depends on
```

---

## 3. Custom Hooks

### What is a Custom Hook?

A custom hook is a JavaScript function that:

- Starts with `use` (like `useStudents`)
- Uses other hooks (`useState`, `useEffect`)
- Returns data and functions

### Why Use Custom Hooks?

```javascript
// ❌ Without custom hook - repetitive
function Page1() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  // ... 20 more lines of code
}

function Page2() {
  // Same code repeated!
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  // ...
}

// ✅ With custom hook - DRY
function Page1() {
  const { students, loading, error } = useStudents();
  // ... use students
}

function Page2() {
  const { students, loading, error } = useStudents();
  // ... use students
}
```

### Building a Custom Hook

```javascript
export function useStudents() {
  // State management
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Side effect
  useEffect(() => {
    fetchStudents();
  }, []);

  // Async function
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentService.getStudents();
      setStudents(data);
    } catch (err) {
      setError("Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  // CRUD operations
  const addStudent = async (data) => {
    const newStudent = await studentService.createStudent(data);
    setStudents([...students, newStudent]);
    return newStudent;
  };

  const updateStudent = async (id, data) => {
    const updated = await studentService.updateStudent(id, data);
    setStudents(students.map((s) => (s.id === id ? updated : s)));
    return updated;
  };

  const deleteStudent = async (id) => {
    await studentService.deleteStudent(id);
    setStudents(students.filter((s) => s.id !== id));
  };

  // Return everything hook provides
  return {
    students,
    loading,
    error,
    addStudent,
    updateStudent,
    deleteStudent,
    refetch: fetchStudents,
  };
}
```

### Using the Custom Hook

```javascript
function DashboardPage() {
  const { students, loading, error, deleteStudent } = useStudents();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      {students.map((s) => (
        <StudentCard
          key={s.id}
          student={s}
          onDelete={() => deleteStudent(s.id)}
        />
      ))}
    </div>
  );
}
```

### Common Custom Hooks Patterns

```javascript
// 1. Data fetching
export function useFetch(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, error, loading };
}

// 2. Form handling
export function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return { values, handleChange };
}

// 3. Local storage
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  const setValue2 = (value) => {
    setValue(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  return [value, setValue2];
}
```

---

## 4. Virtual DOM

### What is the Virtual DOM?

The Virtual DOM is an **in-memory representation** of the real DOM.

```
Virtual DOM (JavaScript object)
    ↓ (React's job)
    ↓ (Compare old vs new)
    ↓ (Calculate changes)
    ↓
Real DOM (HTML in browser)
    ↓ (Browser's job)
    ↓ (Render changes)
    ↓
What you see on screen
```

### How It Works

```javascript
// Step 1: Initial render
<div>Count: 0</div>

// Virtual DOM:
{
  type: 'div',
  props: {},
  children: [
    { type: 'text', content: 'Count: 0' }
  ]
}

// Step 2: State changes
setCount(1)

// New Virtual DOM:
{
  type: 'div',
  props: {},
  children: [
    { type: 'text', content: 'Count: 1' }  // Changed!
  ]
}

// Step 3: React compares old vs new (diffing)
// Result: Only the text changed

// Step 4: Update real DOM
// Only update the text, not the entire div

// Step 5: Browser re-renders
// You see: Count: 1
```

### Why It's Fast

```javascript
// ❌ Without Virtual DOM
// Every state change updates entire DOM
setCount(1); // Re-render entire page
setName("John"); // Re-render entire page
setAge(25); // Re-render entire page
// Result: 3 full page re-renders = slow

// ✅ With Virtual DOM
setCount(1); // Update Virtual DOM, compare, update only changed part
setName("John"); // Update Virtual DOM, compare, update only changed part
setAge(25); // Update Virtual DOM, compare, update only changed part
// Result: Only 3 targeted updates = fast
```

### Key to Performance: Key Prop

When rendering lists:

```javascript
// ❌ Without key (bad - causes re-renders)
{
  students.map((student) => (
    <StudentCard student={student} /> // No key
  ));
}

// ✅ With key (good - efficient updates)
{
  students.map((student) => <StudentCard key={student.id} student={student} />);
}
```

**Why?** React uses key to identify which items changed/added/removed

---

## 5. Closures in React

### What is a Closure?

A closure is a function that remembers variables from its outer scope.

```javascript
function makeCounter() {
  let count = 0; // Outer scope variable

  return function increment() {
    count++; // Closure: remembers 'count'
    console.log(count);
  };
}

const counter = makeCounter();
counter(); // 1
counter(); // 2
counter(); // 3
```

### Closures in React Event Handlers

```javascript
function StudentForm() {
  const [formData, setFormData] = useState({});

  // This function is a closure!
  // It "remembers" the 'name' and 'value' from handleChange
  const handleChange = (e) => {
    const { name, value } = e.target; // Captured in closure

    setFormData((prev) => ({
      ...prev,
      [name]: value, // Closure: remembers 'prev'
    }));
  };

  return (
    <input
      name="age"
      onChange={handleChange} // Closure remembers 'name', 'value'
    />
  );
}
```

### Closures with Array Methods

```javascript
function StudentsList() {
  const students = [...]

  // Closure inside map
  return students.map(student => (
    // This function is a closure
    // It "remembers" the 'student' variable
    <StudentCard
      key={student.id}
      student={student}  // Closure: remembers 'student'
      onDelete={() => deleteStudent(student.id)}  // Closure
    />
  ))
}
```

### Common Closure Pattern

```javascript
function handleClick(id) {
  return () => {
    // Returns a function (closure)
    deleteStudent(id); // Remembers 'id'
  };
}

// Usage
<button onClick={handleClick(student.id)}>Delete</button>;

// What happens:
// 1. handleClick(123) is called
// 2. Returns a function: () => deleteStudent(123)
// 3. That function "remembers" id = 123
// 4. When button clicks, the function runs
// 5. deleteStudent(123) is called
```

### Why Closures Matter

```javascript
// ❌ Problem without closure
{
  students.map((student, index) => (
    <button onClick={() => alert(index)}>
      {/* Always shows same index! */}
    </button>
  ));
}

// ✅ Solution with closure
{
  students.map((student) => (
    <button onClick={() => alert(student.id)}>
      {/* Shows correct id via closure */}
    </button>
  ));
}
```

---

## 6. Props & Component Reusability

### What are Props?

Props (properties) are arguments passed to components.

```javascript
// Defining a component with props
function StudentCard({ student, onEdit, onDelete }) {
  return (
    <div>
      <h3>{student.name}</h3>
      <button onClick={() => onEdit(student)}>Edit</button>
      <button onClick={() => onDelete(student.id)}>Delete</button>
    </div>
  );
}

// Using the component with props
<StudentCard
  student={{ id: 1, name: "Alice", age: 20 }}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>;
```

### Props are Read-Only

```javascript
// ❌ Don't modify props
function Component({ value }) {
  value = value + 1; // ❌ Wrong!
}

// ✅ Use state if you need to modify
function Component({ value }) {
  const [localValue, setLocalValue] = useState(value);
  setLocalValue(localValue + 1); // ✅ Correct
}
```

### Props Flow (One Direction)

```
Parent
  ↓ (passes props down)
  ↓
Child
  ↑ (calls callback up)
  ↑
Parent (receives update via callback)
```

### Example from Project

```javascript
// Parent: DashboardPage
function DashboardPage() {
  const { students, deleteStudent } = useStudents();

  const handleDelete = async (id) => {
    await deleteStudent(id);
  };

  return (
    <div>
      {students.map((student) => (
        <StudentCard
          key={student.id}
          student={student} // Passing data down
          onDelete={handleDelete} // Passing callback down
        />
      ))}
    </div>
  );
}

// Child: StudentCard
function StudentCard({ student, onDelete }) {
  return (
    <button onClick={() => onDelete(student.id)}>
      {/* Calling callback up */}
      Delete
    </button>
  );
}
```

### Props vs State

```javascript
function Component({ propValue }) {
  const [stateValue, setStateValue] = useState(0);

  // Props: Come from parent, read-only, changes trigger re-render
  // State: Local to component, mutable (via setState), changes trigger re-render
}
```

---

## 7. Conditional Rendering

### Pattern 1: if/else

```javascript
function Component() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn) {
    return <Dashboard />;
  } else {
    return <LoginPage />;
  }
}
```

### Pattern 2: Ternary Operator

```javascript
function Component() {
  const { loading, error, data } = useFetch("/api/students");

  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <StudentsList students={data} />
      )}
    </div>
  );
}
```

### Pattern 3: Logical AND (&&)

```javascript
function Component() {
  const { error } = useStudents();

  return <div>{error && <ErrorMessage message={error} />}</div>;
}

// Only renders ErrorMessage if error is truthy
```

### Pattern 4: Switch Statement

```javascript
function StatusBadge({ status }) {
  switch (status) {
    case "active":
      return <span className="green">Active</span>;
    case "pending":
      return <span className="yellow">Pending</span>;
    case "inactive":
      return <span className="red">Inactive</span>;
    default:
      return <span>Unknown</span>;
  }
}
```

### Pattern 5: Object Mapping

```javascript
function ViewToggle({ viewType }) {
  const views = {
    card: <CardView />,
    table: <TableView />,
    list: <ListView />,
  };

  return views[viewType] || views.card; // Default to card
}
```

### From Project: DashboardPage

```javascript
export function DashboardPage() {
  const { students, loading, error } = useStudents()

  return (
    <main>
      {loading && <LoadingSpinner />}  {/* Conditional 1 */}

      {error && <ErrorMessage />}  {/* Conditional 2 */}

      {!loading && students.length === 0 && (
        <EmptyState />  {/* Conditional 3 */}
      )}

      {!loading && students.length > 0 && (
        <StudentList students={students} />  {/* Conditional 4 */}
      )}
    </main>
  )
}
```

---

## 8. Event Handling

### Basic Event Handling

```javascript
function Component() {
  const handleClick = () => {
    console.log("Button clicked!");
  };

  return <button onClick={handleClick}>Click Me</button>;
}
```

### Access Event Object

```javascript
function Component() {
  const handleChange = (e) => {
    console.log(e.target.value); // Input value
  };

  return <input onChange={handleChange} />;
}
```

### Arrow Functions vs Bind

```javascript
// ❌ Regular function - 'this' issues (not usually used in functional components)
function Component() {
  function handleClick() {
    console.log(this); // undefined in functional components
  }
  return <button onClick={handleClick}>Click</button>;
}

// ✅ Arrow function - cleaner
function Component() {
  const handleClick = () => {
    console.log("Clicked");
  };
  return <button onClick={handleClick}>Click</button>;
}

// ✅ Inline arrow function
function Component() {
  return <button onClick={() => console.log("Clicked")}>Click</button>;
}
```

### Passing Parameters

```javascript
// ❌ Wrong - calls function immediately
<button onClick={handleDelete(id)}>Delete</button>

// ✅ Correct - arrow function delays execution
<button onClick={() => handleDelete(id)}>Delete</button>

// ✅ Also correct - function reference with closure
function handleDelete(id) {
  return () => {
    deleteStudent(id)
  }
}
<button onClick={handleDelete(id)}>Delete</button>
```

### Common Events

```javascript
function Component() {
  return (
    <form>
      <input
        onChange={(e) => {}} // When input value changes
        onBlur={(e) => {}} // When input loses focus
        onFocus={(e) => {}} // When input gets focus
      />

      <button
        onClick={(e) => {}} // When button clicked
      />

      <form
        onSubmit={(e) => {
          e.preventDefault(); // Prevent page reload
        }}
      />
    </form>
  );
}
```

### From Project: StudentForm

```javascript
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

  // Clear error when user starts typing
  if (errors[name]) {
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }
};

const handleSubmit = (e) => {
  e.preventDefault(); // Prevent form reload

  if (validateForm()) {
    onSubmit(formData);
  }
};
```

---

## 9. Component Lifecycle

### Class Components (Old Way)

```javascript
class StudentCard extends React.Component {
  componentDidMount() {
    // Runs when component mounts
    console.log("Component mounted");
  }

  componentDidUpdate(prevProps, prevState) {
    // Runs when component updates
    console.log("Component updated");
  }

  componentWillUnmount() {
    // Runs when component unmounts
    console.log("Component will unmount");
  }

  render() {
    return <div>...</div>;
  }
}
```

### Functional Components (New Way with Hooks)

```javascript
function StudentCard() {
  // Mount
  useEffect(() => {
    console.log("Component mounted");

    // Unmount
    return () => {
      console.log("Component will unmount");
    };
  }, []); // Empty array = run on mount

  // Update
  useEffect(() => {
    console.log("Component updated");
  }); // No array = run on every render
}
```

### Lifecycle Flow

```
1. Component Created
   ↓
2. Render (React calls component function)
   ↓
3. useEffect with empty dependency (mount)
   ↓
4. Component Displayed on Screen
   ↓
5. State Changes → Re-render
   ↓
6. useEffect with dependencies (update)
   ↓
7. Component Still on Screen
   ↓
8. Component Removed from Screen
   ↓
9. useEffect cleanup function (unmount)
   ↓
10. Component Destroyed
```

---

## 10. Key Prop

### Why Key is Important

When rendering lists, React uses `key` to identify elements:

```javascript
// ❌ Without key
{
  students.map((student) => <StudentCard student={student} />);
}

// ✅ With key
{
  students.map((student) => <StudentCard key={student.id} student={student} />);
}
```

### Key Determines Identity

```javascript
// If you add student at beginning
const newList = [{ id: "new", name: "Bob" }, ...students];

// Without key: React might reuse StudentCard DOM
// Problem: Component state gets confused!

// With key: React knows it's a new item
// Solution: Creates new StudentCard component
```

### Key Must Be Unique

```javascript
// ❌ Using index as key (bad when list changes)
{
  students.map((student, index) => (
    <StudentCard key={index} student={student} />
  ));
}

// ✅ Using unique ID as key (good)
{
  students.map((student) => <StudentCard key={student.id} student={student} />);
}

// ✅ Or unique property
{
  students.map((student) => (
    <StudentCard key={`${student.id}-${student.email}`} />
  ));
}
```

### When Key Matters Most

Key matters when list items:

- Get added/removed
- Get reordered
- Get filtered

```javascript
// Example: Adding student
students = [alice, bob, charlie];

students = [dave, alice, bob, charlie];

// Without key: Might reuse Alice's DOM for Dave - confusing!
// With key: Creates new DOM for Dave - correct!
```

---

## React Concepts Summary Table

| Concept               | Purpose                    | Example                                 |
| --------------------- | -------------------------- | --------------------------------------- |
| useState              | Manage component state     | `const [count, setCount] = useState(0)` |
| useEffect             | Run side effects           | `useEffect(() => fetchData(), [])`      |
| Custom Hooks          | Reuse stateful logic       | `const { students } = useStudents()`    |
| Virtual DOM           | Efficient updates          | React updates only changed DOM          |
| Closures              | Remember variables         | `map` callbacks remember items          |
| Props                 | Pass data to components    | `<Card student={student} />`            |
| Conditional Rendering | Show/hide based on state   | `{loading && <Spinner />}`              |
| Events                | Handle user interactions   | `onClick={handleClick}`                 |
| Lifecycle             | React to component changes | `useEffect(cleanup, [])`                |
| Keys                  | Identify list elements     | `key={student.id}`                      |

---

## Best Practices

### ✅ Do This

```javascript
// 1. Call hooks at top level
function Component() {
  const [value, setValue] = useState(0)  // Top level
  // component code
}

// 2. Use descriptive names
const [isLoading, setIsLoading] = useState(false)
const handleStudentDelete = (id) => {}

// 3. Keep components small and focused
function StudentCard() {
  // Just render a card
}

// 4. Extract complex logic to hooks
const { students, loading, error } = useStudents()

// 5. Use proper keys in lists
key={student.id}
```

### ❌ Don't Do This

```javascript
// 1. Call hooks inside conditions
if (condition) {
  const [value, setValue] = useState(0)  // ❌
}

// 2. Mutate state directly
students[0].name = 'New Name'  // ❌
setStudents([...students])     // ✅

// 3. Use index as key
key={index}  // ❌ when list changes

// 4. Forget cleanup in useEffect
useEffect(() => {
  const timer = setInterval(...)
  // Missing cleanup function ❌
}, [])

// 5. Create functions inside render
function Component() {
  const handleClick = () => {}  // ✅

  return (
    // ❌ Creating new function every render
    <button onClick={() => handleClick()} />
  )
}
```

---

## Conclusion

These React concepts form the foundation of building interactive UIs:

1. **useState** - Data that changes
2. **useEffect** - Side effects and cleanup
3. **Custom Hooks** - Reusable logic
4. **Virtual DOM** - Efficient updates
5. **Closures** - Remember data in functions
6. **Props** - Pass data and callbacks
7. **Rendering** - Conditionally show UI
8. **Events** - Handle user interaction
9. **Lifecycle** - React to changes
10. **Keys** - Identify list elements

Master these and you master React! 🚀
