import prisma from '@/lib/server/prisma'
import LoanForm from '../loan-form'

const NewLoanPage = async () => {
  // Fetch users for the dropdown
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
    },
  })

  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-bold">Create New Loan</h1>
      <LoanForm users={users} mode="create" />
    </div>
  )
}

export default NewLoanPage
