'use client'

type StatusBadgeProps = {
  status: string
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  // Get status styles with improved contrast
  const getStatusStyles = () => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800'
      case 'PAID':
        return 'bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'
      case 'DEFAULTED':
        return 'bg-red-100 text-red-800 border border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
    }
  }

  // Get appropriate aria label for screen readers
  const getAriaLabel = () => {
    switch (status) {
      case 'ACTIVE':
        return 'Loan status: Active'
      case 'PENDING':
        return 'Loan status: Pending'
      case 'PAID':
        return 'Loan status: Paid'
      case 'DEFAULTED':
        return 'Loan status: Defaulted'
      default:
        return `Loan status: ${status}`
    }
  }

  return (
    <span
      className={`rounded px-2 py-1 text-xs font-medium ${getStatusStyles()}`}
      role="status"
      aria-label={getAriaLabel()}
    >
      {status}
    </span>
  )
}

export default StatusBadge
