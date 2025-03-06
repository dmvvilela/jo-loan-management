'use server'

import prisma from '@/lib/server/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Validation schema for user creation
const UserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
})

export type UserFormData = z.infer<typeof UserSchema>

// Create a new user
export const createUser = async (formData: UserFormData) => {
  try {
    // Validate input data
    const validatedData = UserSchema.parse(formData)

    // Create user in database
    const user = await prisma.user.create({
      data: validatedData,
    })

    revalidatePath('/users')
    return { success: true, data: user }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }
    // Handle unique constraint violation
    if ((error as { code?: string }).code === 'P2002') {
      return { success: false, error: 'A user with this email already exists' }
    }

    return { success: false, error: 'Failed to create user' }
  }
}

// Get all users
export const getUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { name: 'asc' },
    })

    return { success: true, data: users }
  } catch (error) {
    return { success: false, error: 'Failed to fetch users' }
  }
}
