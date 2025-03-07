'use client'

import { LoanFormData, createLoan, updateLoan } from '@/lib/server/loans'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type LoanFormProps = {
  initialData?: Partial<LoanFormData>
  loanId?: string
  users: { id: string; name: string | null }[]
  mode: 'create' | 'edit'
}

const LoanForm = ({ initialData, loanId, users, mode }: LoanFormProps) => {
  const router = useRouter()
  const [formData, setFormData] = useState<Partial<LoanFormData>>(
    initialData || {
      amount: 0,
      interestRate: 0,
      termMonths: 12,
      lenderId: '',
      borrowerId: '',
      status: 'PENDING',
    }
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      const result =
        mode === 'create' ? await createLoan(formData as LoanFormData) : await updateLoan(loanId!, formData)

      if (result.success) {
        router.push('/loans')
      } else {
        if (Array.isArray(result.error)) {
          const formattedErrors: Record<string, string> = {}
          result.error.forEach((err) => {
            if (err.path) {
              formattedErrors[err.path[0]!] = err.message
            }
          })
          setErrors(formattedErrors)
        } else {
          setErrors({ form: result.error as string })
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
      {errors.form && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/30">
          <p className="text-sm text-red-700 dark:text-red-200">{errors.form}</p>
        </div>
      )}

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Loan Amount
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
          step="0.01"
          min="0"
          required
        />
        {errors.amount && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount}</p>}
      </div>

      <div>
        <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Interest Rate (%)
        </label>
        <input
          type="number"
          id="interestRate"
          name="interestRate"
          value={formData.interestRate}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
          step="0.01"
          min="0"
          required
        />
        {errors.interestRate && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.interestRate}</p>}
      </div>

      <div>
        <label htmlFor="termMonths" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Term (Months)
        </label>
        <input
          type="number"
          id="termMonths"
          name="termMonths"
          value={formData.termMonths}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
          min="1"
          required
        />
        {errors.termMonths && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.termMonths}</p>}
      </div>

      <div>
        <label htmlFor="lenderId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Lender
        </label>
        <select
          id="lenderId"
          name="lenderId"
          value={formData.lenderId}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
          required
        >
          <option value="">Select a lender</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name || 'Unnamed User'}
            </option>
          ))}
        </select>
        {errors.lenderId && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.lenderId}</p>}
      </div>

      <div>
        <label htmlFor="borrowerId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Borrower
        </label>
        <select
          id="borrowerId"
          name="borrowerId"
          value={formData.borrowerId}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
          required
        >
          <option value="">Select a borrower</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name || 'Unnamed User'}
            </option>
          ))}
        </select>
        {errors.borrowerId && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.borrowerId}</p>}
      </div>

      {mode === 'edit' && (
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
          >
            <option value="PENDING">Pending</option>
            <option value="ACTIVE">Active</option>
            <option value="PAID">Paid</option>
            <option value="DEFAULTED">Defaulted</option>
          </select>
          {errors.status && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.status}</p>}
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400"
        >
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Loan' : 'Update Loan'}
        </button>
      </div>
    </form>
  )
}

export default LoanForm
