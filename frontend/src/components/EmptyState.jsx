/**
 * EmptyState Component
 * 
 * Displays when no data is available
 * WHY: Improves UX by showing meaningful message instead of blank space
 */
export function EmptyState({ icon = '📭', title = 'No Data', message = 'No items found' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500">{message}</p>
    </div>
  )
}
