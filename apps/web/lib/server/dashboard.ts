'use server'

import prisma from '@/lib/server/prisma'

export type DashboardStats = {
  totalUsers: number
  totalLoans: number
  activeLoans: number
  totalLoanAmount: number
  recentLoans: Array<{
    id: string
    amount: number
    status: string
    lenderName: string
    borrowerName: string
    createdAt: string
  }>
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Get total users
    const totalUsers = await prisma.user.count()

    // Get loan statistics
    const totalLoans = await prisma.loan.count()
    const activeLoans = await prisma.loan.count({
      where: { status: 'ACTIVE' },
    })

    // Calculate total loan amount
    const loanAmountResult = await prisma.loan.aggregate({
      _sum: {
        amount: true,
      },
    })
    const totalLoanAmount = loanAmountResult._sum.amount || 0

    // Get recent loans
    const recentLoans = await prisma.loan.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        lender: {
          select: {
            name: true,
          },
        },
        borrower: {
          select: {
            name: true,
          },
        },
      },
    })

    // Format recent loans for the frontend
    const formattedRecentLoans = recentLoans.map((loan) => ({
      id: loan.id,
      amount: loan.amount,
      status: loan.status,
      lenderName: loan.lender.name || 'Unknown',
      borrowerName: loan.borrower.name || 'Unknown',
      createdAt: loan.createdAt.toISOString(),
    }))

    return {
      totalUsers,
      totalLoans,
      activeLoans,
      totalLoanAmount,
      recentLoans: formattedRecentLoans,
    }
  } catch (error) {
    console.error('Dashboard data error:', error)
    // Return default values in case of error
    return {
      totalUsers: 0,
      totalLoans: 0,
      activeLoans: 0,
      totalLoanAmount: 0,
      recentLoans: [],
    }
  }
}
