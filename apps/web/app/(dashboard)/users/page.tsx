import { getUsers } from '@/lib/server/users'
import UserForm from './user-form'

const UsersPage = async () => {
  const { success, data: users, error } = await getUsers()

  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-bold">Users</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-semibold">Create New User</h2>
          <UserForm />
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">Existing Users</h2>

          {!success ? (
            <div className="rounded bg-red-100 p-4 dark:bg-red-900/30" role="alert">
              <p className="text-red-700 dark:text-red-200">Error: {error}</p>
            </div>
          ) : users?.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400" role="status">
              No users found. Create your first user!
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                    >
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                  {users?.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-200">
                        {user.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-200">
                        {user.email}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UsersPage
