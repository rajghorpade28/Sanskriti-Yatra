import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const contributions = await prisma.contribution.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ contributions })
  } catch (error) {
    console.error("List Contributions API Error:", error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
