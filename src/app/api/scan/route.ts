import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  // Mock vision recognition: always returns Kailasa Temple for demo
  try {
    const object = await prisma.heritageObject.findFirst({
      where: {
        name: 'Kailasa Temple'
      }
    })

    if (object) {
      return NextResponse.json({ objectId: object.id })
    } else {
      return NextResponse.json({ error: 'Object not found' }, { status: 404 })
    }
  } catch (error) {
    console.error("Scan API Error:", error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
