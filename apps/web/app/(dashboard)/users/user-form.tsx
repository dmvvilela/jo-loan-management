'use client'

import { createUser, UserFormData } from '@/lib/server/users'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const UserForm = () => {
  const router = useRouter()
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})
    setSuccessMessage('')

    try {
      const result = await createUser(formData)

      if (result.success) {
        setSuccessMessage('User created successfully!')
        setFormData({ name: '', email: '' }) // Reset form
        router.refresh() // Refresh the page to show the new user
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
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      {errors.form && <div className="rounded bg-red-100 p-3 text-red-700">{errors.form}</div>}

      {successMessage && <div className="rounded bg-green-100 p-3 text-green-700">{successMessage}</div>}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create User'}
        </button>
      </div>
    </form>
  )
}

export default UserForm
