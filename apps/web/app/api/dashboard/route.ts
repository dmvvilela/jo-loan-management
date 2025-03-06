import prisma from '@/lib/server/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
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

    return NextResponse.json({
      totalUsers,
      totalLoans,
      activeLoans,
      totalLoanAmount,
      recentLoans: formattedRecentLoans,
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}
