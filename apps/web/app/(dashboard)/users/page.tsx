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
            <div className="rounded bg-red-100 p-4" role="alert">
              <p className="text-red-700">Error: {error}</p>
            </div>
          ) : users?.length === 0 ? (
            <p className="text-gray-500" role="status">
              No users found. Create your first user!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th scope="col" className="border-b px-4 py-2 text-left">
                      Name
                    </th>
                    <th scope="col" className="border-b px-4 py-2 text-left">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="border-b px-4 py-2">{user.name}</td>
                      <td className="border-b px-4 py-2">{user.email}</td>
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
