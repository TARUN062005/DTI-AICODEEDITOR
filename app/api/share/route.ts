import { NextResponse } from "next/server"
import { getSharedCode } from "@/lib/share-code"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Missing share ID" },
        { status: 400 }
      )
    }

    const sharedCode = await getSharedCode(id)
    
    if (!sharedCode) {
      return NextResponse.json(
        { error: "Share not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(sharedCode)
  } catch (error) {
    console.error("Error fetching shared code:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}