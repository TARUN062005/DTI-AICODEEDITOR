"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Copy } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

export default function SharePage() {
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

        // Fetch from your API endpoint
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
        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load shared code")
        setIsLoading(false)
        console.error(err)
      }
    }

    fetchSharedCode()
  }, [searchParams])

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        toast({
          title: "Copied!",
          description: "Code copied to clipboard",
        })
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to copy code",
          variant: "destructive",
        })
      })
  }

  const downloadCode = () => {
    try {
      const extension = fileName.includes('.') ? '' : '.txt'
      const blob = new Blob([content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${fileName}${extension}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 sm:p-6 bg-slate-100 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-slate-100 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Shared Code: {fileName}
          </h1>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={copyToClipboard}
              disabled={!content}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button 
              variant="outline" 
              onClick={downloadCode}
              disabled={!content}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Link href="/code-editor" passHref>
              <Button disabled={!content}>
                Open in Editor
              </Button>
            </Link>
          </div>
        </div>

        {error ? (
          <Card className="p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <p className="text-red-700 dark:text-red-400">{error}</p>
            <Link href="/code-editor" passHref>
              <Button className="mt-4">
                Create New Code
              </Button>
            </Link>
          </Card>
        ) : (
          <Card className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <pre className="overflow-auto max-h-[70vh] p-4 bg-slate-100 dark:bg-slate-900 rounded-md text-sm font-mono whitespace-pre-wrap">
              {content}
            </pre>
          </Card>
        )}
      </div>
    </div>
  )
}