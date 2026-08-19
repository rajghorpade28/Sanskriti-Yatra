import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json()
    const { action } = body // 'APPROVED' | 'REJECTED'

    if (action !== 'APPROVED' && action !== 'REJECTED') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Transaction to update contribution and user stats if approved
    const result = await prisma.$transaction(async (tx) => {
      const contribution = await tx.contribution.update({
        where: { id },
        data: { status: action }
      })

      if (action === 'APPROVED') {
        // Find user and upgrade their stats/level logic here
        // Simple logic for demo: bump a counter (assuming we have one or just use contributions length in passport)
        // We will just let the passport page recalculate based on Approved contributions
      }

      return contribution
    })

    return NextResponse.json({ success: true, contribution: result })
  } catch (error) {
    console.error("Approve API Error:", error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
