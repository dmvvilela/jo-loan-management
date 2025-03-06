export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
        <p className="text-lg font-medium text-gray-700">Loading...</p>
      </div>
    </div>
  )
}
