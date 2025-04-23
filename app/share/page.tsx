"use client"

import { Suspense } from "react"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Copy } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

// Separate client component that uses useSearchParams
function ShareContent() {
  const searchParams = useSearchParams()
  const [fileName, setFileName] = useState("shared-code")
  const [content, setContent] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSharedCode = async () => {
      try {
        const shareId = searchParams.get("id")
        if (!shareId) {
          setError("No share ID found in the URL")
          setIsLoading(false)
          return
        }
        const response = await fetch(`/api/share?id=${shareId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch shared code")
        }
        const data = await response.json()
        if (!data.content) {
          throw new Error("No content found in the share")
        }
        setFileName(data.fileName || "shared-code")
        setContent(data.content)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load shared code")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSharedCode()
  }, [searchParams])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">{fileName}</h1>
        <div className="space-x-2">
          <Button onClick={() => navigator.clipboard.writeText(content)}>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
      <pre className="bg-gray-100 p-4 rounded-lg">
        <code>{content}</code>
      </pre>
    </Card>
  )
}

// Main page component with Suspense
export default function SharePage() {
  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <ShareContent />
      </Suspense>
    </div>
  )
}
