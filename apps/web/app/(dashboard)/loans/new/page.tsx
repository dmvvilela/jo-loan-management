import prisma from '@/lib/server/prisma'
import LoanForm from '../loan-form'

const NewLoanPage = async () => {
  // Fetch users for the dropdown and handle null names
  const usersFromDb = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
    },
  })

  // Transform the data to ensure name is always a string
  // TODO: This is a temporary fix to ensure the form works.
  const users = usersFromDb.map((user) => ({
    id: user.id,
    name: user.name || '',
  }))

  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-bold">Create New Loan</h1>
      <LoanForm users={users} mode="create" />
    </div>
  )
}

export default NewLoanPage
