import { getLoanById } from '@/lib/server/loans'
import prisma from '@/lib/server/prisma'
import { notFound } from 'next/navigation'
import LoanForm from '../../loan-form'

const EditLoanPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  // Await the params before using them
  const resolvedParams = await params
  const id = resolvedParams.id

  if (!id) {
    notFound()
  }

  const { success, data: loan } = await getLoanById(id)

  if (!success || !loan) {
    notFound()
  }

  // Fetch users for the dropdown
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
    },
  })

  // Prepare initial form data with proper type casting for status
  const initialData = {
    amount: loan.amount,
    interestRate: loan.interestRate,
    termMonths: loan.termMonths,
    lenderId: loan.lenderId,
    borrowerId: loan.borrowerId,
    status: loan.status as 'PENDING' | 'ACTIVE' | 'PAID' | 'DEFAULTED',
  }

  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-bold">Edit Loan</h1>
      <LoanForm initialData={initialData} loanId={loan.id} users={users} mode="edit" />
    </div>
  )
}

export default EditLoanPage
