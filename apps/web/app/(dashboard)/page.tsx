import { ClientHeader } from '@/components/dashboard/client-header'
import { DashboardTabs } from '@/components/dashboard/dashboard-tabs'
import { Main } from '@/components/layout/main'
import { getDashboardStats } from '@/lib/server/dashboard'
import { Button } from '@workspace/ui/components/button'
import Link from 'next/link'

export default async function DashboardPage() {
  // Fetch dashboard data using server action
  const stats = await getDashboardStats()

  return (
    <>
      {/* Use client component for the header */}
      <ClientHeader />

      {/* ===== Main ===== */}
      <Main>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Loan Management Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Link href="/loans/new">
              <Button variant="default">Create New Loan</Button>
            </Link>
          </div>
        </div>

        {/* Use ClientTabs component instead of direct Tabs usage */}
        <DashboardTabs stats={stats} />
      </Main>
    </>
  )
}
