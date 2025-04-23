"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CollaborationChat } from "./collaboration-chat"
import { getAIResponse } from "@/lib/ai-service"

interface AIFabProps {
  projectId: string
}

export function AIFab({ projectId }: AIFabProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [messages, setMessages] = useState<any[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your AI coding assistant. How can I help you with this project?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
  ])

  const toggleChat = () => {
    if (isProcessing) return

    setIsProcessing(true)
    setTimeout(() => {
      setIsChatOpen(!isChatOpen)
      setIsProcessing(false)
    }, 300)
  }

  const handleSendMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return

    // Add user message
    const newUserMessage = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, newUserMessage])
    setIsProcessing(true)

    try {
      // Prepare conversation history for Gemini
      const conversationHistory = messages
        .filter(msg => msg.content)
        .map(msg => ({
          role: msg.role === "assistant" ? "assistant" : "user",
          content: msg.content
        }))

      // Get AI response from Gemini
      const aiResponse = await getAIResponse([
        ...conversationHistory,
        { role: "user", content: userMessage }
      ])

      // Add AI response
      const aiMessage = {
        id: Date.now().toString() + "-ai",
        role: "assistant",
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error getting AI response:", error)
      
      // Add error message
      const errorMessage = {
        id: Date.now().toString() + "-error",
        role: "assistant",
        content: "Sorry, I couldn't process your request. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <TooltipProvider>
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className={`h-12 w-12 rounded-full shadow-lg ${isProcessing ? "bg-amber-500" : "bg-emerald-600"} ${isChatOpen ? "bg-emerald-700" : ""}`}
                onClick={toggleChat}
              >
                {isProcessing ? (
                  <Icons.spinner className="h-5 w-5 animate-spin" />
                ) : isChatOpen ? (
                  <Icons.x className="h-5 w-5" />
                ) : (
                  <Icons.messageSquare className="h-5 w-5" />
                )}
                <span className="sr-only">{isChatOpen ? "Close Chat" : "Open Chat"}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{isChatOpen ? "Close Chat" : "Open Chat"}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      {isChatOpen && (
        <CollaborationChat 
          projectId={projectId} 
          messages={messages}
          isProcessing={isProcessing}
          onClose={() => setIsChatOpen(false)} 
          onSendMessage={handleSendMessage} 
        />
      )}
    </>
  )
}