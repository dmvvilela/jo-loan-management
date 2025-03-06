import StatusBadge from '@/components/status-badge'
import { getLoans } from '@/lib/server/loans'
import Link from 'next/link'

const LoansPage = async () => {
  const { success, data: loans, error } = await getLoans()

  if (!success) {
    return (
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Loans</h1>
        <div className="rounded bg-red-100 p-4">
          <p className="text-red-700">Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Loans</h1>
        <Link href="/loans/new" className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          Create New Loan
        </Link>
      </div>

      {loans?.length === 0 ? (
        <p className="text-gray-500">No loans found. Create your first loan!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th scope="col" className="border-b px-4 py-2 text-left">
                  Amount
                </th>
                <th scope="col" className="border-b px-4 py-2 text-left">
                  Interest Rate
                </th>
                <th scope="col" className="border-b px-4 py-2 text-left">
                  Term (Months)
                </th>
                <th scope="col" className="border-b px-4 py-2 text-left">
                  Status
                </th>
                <th scope="col" className="border-b px-4 py-2 text-left">
                  Lender
                </th>
                <th scope="col" className="border-b px-4 py-2 text-left">
                  Borrower
                </th>
                <th scope="col" className="border-b px-4 py-2 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loans?.map((loan) => (
                <tr key={loan.id} className="hover:bg-gray-50">
                  <td className="border-b px-4 py-2">${loan.amount.toFixed(2)}</td>
                  <td className="border-b px-4 py-2">{loan.interestRate}%</td>
                  <td className="border-b px-4 py-2">{loan.termMonths}</td>
                  <td className="border-b px-4 py-2">
                    <StatusBadge status={loan.status} />
                  </td>
                  <td className="border-b px-4 py-2">{loan.lender.name}</td>
                  <td className="border-b px-4 py-2">{loan.borrower.name}</td>
                  <td className="border-b px-4 py-2">
                    <Link href={`/loans/${loan.id}`} className="mr-2 text-blue-500 hover:text-blue-700">
                      View
                    </Link>
                    <Link href={`/loans/${loan.id}/edit`} className="text-green-500 hover:text-green-700">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default LoansPage
