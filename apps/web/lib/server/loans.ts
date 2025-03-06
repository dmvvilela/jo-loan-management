'use server'

import prisma from '@/lib/server/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Validation schema for loan creation/update
const LoanSchema = z.object({
  amount: z.number().positive('Loan amount must be positive'),
  interestRate: z.number().min(0, 'Interest rate cannot be negative'),
  termMonths: z.number().int().positive('Loan term must be a positive integer'),
  lenderId: z.string().uuid('Invalid lender ID'),
  borrowerId: z.string().uuid('Invalid borrower ID'),
  status: z.enum(['PENDING', 'ACTIVE', 'PAID', 'DEFAULTED']).optional(),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
})

export type LoanFormData = z.infer<typeof LoanSchema>

// Create a new loan
export const createLoan = async (formData: LoanFormData) => {
  try {
    // Validate input data
    const validatedData = LoanSchema.parse(formData)

    // Create loan in database
    const loan = await prisma.loan.create({
      data: validatedData,
    })

    revalidatePath('/loans')
    return { success: true, data: loan }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }
    return { success: false, error: 'Failed to create loan' }
  }
}

// Get all loans
export const getLoans = async () => {
  try {
    const loans = await prisma.loan.findMany({
      include: {
        lender: true,
        borrower: true,
      },
    })

    return { success: true, data: loans }
  } catch (error) {
    return { success: false, error: 'Failed to fetch loans' }
  }
}

// Get a single loan by ID
export const getLoanById = async (id: string) => {
  try {
    const loan = await prisma.loan.findUnique({
      where: { id },
      include: {
        lender: true,
        borrower: true,
        payments: true,
      },
    })

    if (!loan) {
      return { success: false, error: 'Loan not found' }
    }

    return { success: true, data: loan }
  } catch (error) {
    return { success: false, error: 'Failed to fetch loan' }
  }
}

// Update a loan
export const updateLoan = async (id: string, formData: Partial<LoanFormData>) => {
  try {
    // Validate input data
    const validatedData = LoanSchema.partial().parse(formData)

    // Update loan in database
    const loan = await prisma.loan.update({
      where: { id },
      data: validatedData,
    })

    revalidatePath(`/loans/${id}`)
    revalidatePath('/loans')
    return { success: true, data: loan }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }
    return { success: false, error: 'Failed to update loan' }
  }
}

// Delete a loan
export const deleteLoan = async (id: string) => {
  try {
    await prisma.loan.delete({
      where: { id },
    })

    revalidatePath('/loans')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete loan' }
  }
}
