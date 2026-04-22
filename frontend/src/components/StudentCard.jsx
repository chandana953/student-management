import { Button } from './Button'

/**
 * StudentCard Component
 * 
 * Card representation of a single student
 * WHY: Modular card design allows flexible rendering of students in different layouts
 * (grid, list). Props make it reusable with different data sources.
 * 
 * Props:
 * - student: {id, name, age, course}
 * - onEdit: callback function when edit is clicked
 * - onDelete: callback function when delete is clicked
 */
export function StudentCard({ student, onEdit, onDelete }) {
  // Handle both MongoDB _id and regular id fields
  const studentId = student._id || student.id

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold">{student.name}</h3>
          <p className="text-sm text-gray-500">ID: {studentId}</p>
        </div>
        <span className="bg-primary-100 text-primary-800 text-xs font-semibold px-3 py-1 rounded-full">
          {student.course}
        </span>
      </div>

      <div className="mb-4 text-gray-600">
        <p>📅 <strong>Age:</strong> {student.age} years</p>
        <p>📖 <strong>Course:</strong> {student.course}</p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="secondary"
          onClick={() => onEdit(student)}
          className="flex-1 text-sm"
        >
          ✏️ Edit
        </Button>
        <Button
          variant="danger"
          onClick={() => onDelete(studentId)}
          className="flex-1 text-sm"
        >
          🗑️ Delete
        </Button>
      </div>
    </div>
  )
}
