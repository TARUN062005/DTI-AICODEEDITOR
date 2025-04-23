"use client"

import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Loader2 } from "lucide-react"

interface CollaborationChatProps {
  projectId: string
  messages: any[]
  isProcessing: boolean
  onClose: () => void
  onSendMessage: (message: string) => Promise<void>
}

export function CollaborationChat({
  projectId,
  messages,
  isProcessing,
  onClose,
  onSendMessage
}: CollaborationChatProps) {
  const [message, setMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const formatCodeBlocks = (content: string) => {
    if (!content.includes("```")) return content

    const parts = content.split("```")
    return (
      <>
        {parts.map((part, i) =>
          i % 2 === 0 ? (
            <span key={i}>{part}</span>
          ) : (
            <pre key={i} className="my-2 rounded-md bg-slate-800 p-3 font-mono text-xs text-slate-200">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs text-slate-400">{part.includes("\n") ? part.split("\n")[0] : "code"}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-slate-400 hover:text-slate-200"
                  onClick={() => {
                    const code = part.includes("\n") ? part.split("\n").slice(1).join("\n") : part
                    navigator.clipboard.writeText(code)
                  }}
                >
                  <Copy className="h-3 w-3" />
                  <span className="sr-only">Copy code</span>
                </Button>
              </div>
              {part.includes("\n") ? part.split("\n").slice(1).join("\n") : part}
            </pre>
          ),
        )}
      </>
    )
  }

  return (
    <div className="fixed bottom-20 right-6 z-50 w-80 rounded-lg border border-slate-700 bg-slate-900 shadow-xl sm:w-96">
      <div className="flex items-center justify-between border-b border-slate-700 p-3">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-emerald-600/20 p-1">
            <Icons.messageSquare className="h-4 w-4 text-emerald-500" />
          </div>
          <span className="font-medium text-slate-200">Project Assistant</span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-200" onClick={onClose}>
          <Icons.x className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      <div className="h-80 flex flex-col">
        <div className="flex-1 px-4 py-2 overflow-auto">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex gap-2", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                <div
                  className={cn(
                    "h-8 w-8 flex-shrink-0 rounded-full flex items-center justify-center",
                    msg.role === "user" ? "bg-slate-700" : "bg-emerald-700",
                  )}
                >
                  {msg.role === "user" ? "U" : "AI"}
                </div>
                <div
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm max-w-[75%]",
                    msg.role === "user"
                      ? "bg-slate-700 text-slate-200"
                      : "bg-emerald-600/20 text-slate-200 border border-emerald-800/30",
                  )}
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-xs font-medium">{msg.role === "user" ? "You" : "AI Assistant"}</span>
                    <span className="text-xs text-slate-400">{msg.timestamp}</span>
                  </div>
                  <div className="text-sm">{formatCodeBlocks(msg.content)}</div>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex gap-2">
                <div className="h-8 w-8 flex-shrink-0 rounded-full bg-emerald-700 flex items-center justify-center">
                  AI
                </div>
                <div className="flex items-center space-x-1 rounded-lg bg-emerald-600/20 px-3 py-2 border border-emerald-800/30">
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-slate-700 p-3">
          <Input
            placeholder="Ask AI for help..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage(message)
                setMessage("")
              }
            }}
            className="flex-1 bg-slate-800 text-slate-200 border-slate-700 placeholder:text-slate-500"
          />
          <Button
            size="icon"
            className="h-8 w-8 shrink-0 bg-emerald-600 hover:bg-emerald-700"
            onClick={() => {
              handleSendMessage(message)
              setMessage("")
            }}
            disabled={isProcessing || !message.trim()}
          >
            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icons.send className="h-4 w-4" />}
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  )
}