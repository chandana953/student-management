/**
 * Button Component
 * 
 * Reusable button component with different variants
 * WHY: Encapsulates button styling and behavior, making it easy to maintain
 * and ensure consistency across the app. Follows DRY principle.
 */
export function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  className = '' 
}) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  )
}
