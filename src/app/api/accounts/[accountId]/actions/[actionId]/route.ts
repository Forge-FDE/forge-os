import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ accountId: string; actionId: string }> }
) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  try {
    const resolvedParams = await params
    const body = await request.json()
    const { status } = body
    
    if (!status || !['open', 'at_risk', 'closed'].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      )
    }
    
    const action = await prisma.action.update({
      where: {
        id: resolvedParams.actionId,
        accountId: resolvedParams.accountId,
      },
      data: {
        status,
        lastUpdate: new Date(),
      },
    })
    
    return NextResponse.json(action)
  } catch (error) {
    console.error("Error updating action:", error)
    return NextResponse.json(
      { error: "Failed to update action" },
      { status: 500 }
    )
  }
}
