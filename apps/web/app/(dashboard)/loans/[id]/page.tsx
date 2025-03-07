import StatusBadge from '@/components/status-badge'
import { getLoanById } from '@/lib/server/loans'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const LoanDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
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

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Loan Details</h1>
        <div className="flex space-x-2">
          <Link
            href={`/loans/${loan.id}/edit`}
            className="rounded bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-400"
          >
            Edit Loan
          </Link>
          <Link
            href="/loans"
            className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Back to Loans
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
          <h3 className="text-base font-medium leading-6 text-gray-900 dark:text-white">Loan Information</h3>
        </div>
        <div>
          <dl className="divide-y divide-gray-200 dark:divide-gray-700">
            <div className="grid grid-cols-3 px-4 py-3 sm:grid-cols-4">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Amount</dt>
              <dd className="col-span-2 text-sm text-gray-900 sm:col-span-3 dark:text-white">
                ${loan.amount.toFixed(2)}
              </dd>
            </div>
            <div className="grid grid-cols-3 px-4 py-3 sm:grid-cols-4">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Interest Rate</dt>
              <dd className="col-span-2 text-sm text-gray-900 sm:col-span-3 dark:text-white">{loan.interestRate}%</dd>
            </div>
            <div className="grid grid-cols-3 px-4 py-3 sm:grid-cols-4">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Term</dt>
              <dd className="col-span-2 text-sm text-gray-900 sm:col-span-3 dark:text-white">
                {loan.termMonths} months
              </dd>
            </div>
            <div className="grid grid-cols-3 px-4 py-3 sm:grid-cols-4">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
              <dd className="col-span-2 text-sm text-gray-900 sm:col-span-3 dark:text-white">
                <StatusBadge status={loan.status} />
              </dd>
            </div>
            <div className="grid grid-cols-3 px-4 py-3 sm:grid-cols-4">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Lender</dt>
              <dd className="col-span-2 text-sm text-gray-900 sm:col-span-3 dark:text-white">{loan.lender.name}</dd>
            </div>
            <div className="grid grid-cols-3 px-4 py-3 sm:grid-cols-4">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Borrower</dt>
              <dd className="col-span-2 text-sm text-gray-900 sm:col-span-3 dark:text-white">{loan.borrower.name}</dd>
            </div>
            <div className="grid grid-cols-3 px-4 py-3 sm:grid-cols-4">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</dt>
              <dd className="col-span-2 text-sm text-gray-900 sm:col-span-3 dark:text-white">
                {new Date(loan.createdAt).toLocaleDateString()}
              </dd>
            </div>
            <div className="grid grid-cols-3 px-4 py-3 sm:grid-cols-4">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Updated At</dt>
              <dd className="col-span-2 text-sm text-gray-900 sm:col-span-3 dark:text-white">
                {new Date(loan.updatedAt).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <h2 className="mb-3 mt-6 text-xl font-bold">Payment History</h2>
      {loan.payments.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No payments recorded for this loan.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {loan.payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900 dark:text-gray-200">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900 dark:text-gray-200">
                    ${payment.amount.toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-sm">
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium ${
                        payment.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : payment.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
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

export default LoanDetailsPage
