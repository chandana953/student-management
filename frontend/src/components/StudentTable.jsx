import { Button } from './Button'

/**
 * StudentTable Component
 * 
 * Table view of students (alternative to StudentCard)
 * WHY: Provides different layout option for data presentation.
 * Desktop-first approach, can be hidden on mobile.
 * 
 * Props:
 * - students: array of student objects
 * - onEdit: callback for edit action
 * - onDelete: callback for delete action
 */
export function StudentTable({ students, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-100 border-b-2 border-gray-300">
          <tr>
            <th className="px-4 py-3 font-semibold text-gray-700">Name</th>
            <th className="px-4 py-3 font-semibold text-gray-700">Age</th>
            <th className="px-4 py-3 font-semibold text-gray-700">Course</th>
            <th className="px-4 py-3 font-semibold text-gray-700 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => {
            // Handle both MongoDB _id and regular id fields
            const studentId = student._id || student.id
            return (
              <tr key={studentId} className="border-b hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-medium">{student.name}</td>
                <td className="px-4 py-3">{student.age}</td>
                <td className="px-4 py-3">
                  <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm">
                    {student.course}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="secondary"
                      onClick={() => onEdit(student)}
                      className="text-xs px-2 py-1"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => onDelete(studentId)}
                      className="text-xs px-2 py-1"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
