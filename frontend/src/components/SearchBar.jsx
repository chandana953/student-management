/**
 * SearchBar Component
 * 
 * Search input for filtering students (UI only, not functional)
 * WHY: Prepares for future search functionality. Users expect search on dashboard.
 */
export function SearchBar({ placeholder = 'Search students...', onChange }) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        className="input-field pl-10"
        aria-label="Search students"
      />
      <span className="absolute left-3 top-3 text-gray-400">🔍</span>
    </div>
  )
}
