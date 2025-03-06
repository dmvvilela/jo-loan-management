import { getLoanById } from '@/lib/server/loans'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const LoanDetailPage = async ({ params }: { params: { id: string } }) => {
  const { success, data: loan, error } = await getLoanById(params.id)

  if (!success || !loan) {
    notFound()
  }

  return (
    <div className="p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Loan Details</h1>
        <div className="space-x-2">
          <Link href={`/loans/${loan.id}/edit`} className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
            Edit Loan
          </Link>
          <Link href="/loans" className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600">
            Back to Loans
          </Link>
        </div>
      </div>

      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Loan Information</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Details and status of the loan.</p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Amount</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">${loan.amount.toFixed(2)}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Interest Rate</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{loan.interestRate}%</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Term</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{loan.termMonths} months</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <span
                  className={`rounded px-2 py-1 text-xs ${
                    loan.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : loan.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : loan.status === 'PAID'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                  }`}
                >
                  {loan.status}
                </span>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Lender</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{loan.lender.name}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Borrower</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{loan.borrower.name}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Start Date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {loan.startDate ? new Date(loan.startDate).toLocaleDateString() : 'Not started'}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">End Date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {loan.endDate ? new Date(loan.endDate).toLocaleDateString() : 'Not ended'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <h2 className="mb-4 mt-8 text-xl font-bold">Payment History</h2>
      {loan.payments.length === 0 ? (
        <p className="text-gray-500">No payments recorded for this loan.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="border-b px-4 py-2 text-left">Date</th>
                <th className="border-b px-4 py-2 text-left">Amount</th>
                <th className="border-b px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {loan.payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="border-b px-4 py-2">{new Date(payment.date).toLocaleDateString()}</td>
                  <td className="border-b px-4 py-2">${payment.amount.toFixed(2)}</td>
                  <td className="border-b px-4 py-2">
                    <span
                      className={`rounded px-2 py-1 text-xs ${
                        payment.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : payment.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {payment.status}
                    </span>
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

export default LoanDetailPage
