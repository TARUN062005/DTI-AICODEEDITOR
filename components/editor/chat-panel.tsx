"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import axios from 'axios'

interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
  avatar: string
  isAI: boolean
}

interface ChatPanelProps {
  projectId: string
}

export function ChatPanel({ projectId }: ChatPanelProps) {
  const [message, setMessage] = useState("")
  const [activeTab, setActiveTab] = useState<"team" | "ai">("ai")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [error, setError] = useState<string|null>(null)
  const [lastRequestTime, setLastRequestTime] = useState(0)
  const [apiProvider, setApiProvider] = useState<"openai" | "huggingface">("huggingface")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (activeTab === "ai") {
      setMessages([{
        id: "welcome",
        sender: "AI Assistant",
        content: "Hello! I'm your AI coding assistant. How can I help you with this project?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        avatar: "/ai-avatar.png",
        isAI: true,
      }])
    } else {
      setMessages([])
    }
  }, [activeTab])

  const getAIResponse = async (prompt: string) => {
    try {
      if (apiProvider === "openai") {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are an expert coding assistant. Provide clear, concise answers with code examples when appropriate."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 1000
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
            }
          }
        )
        return response.data.choices[0]?.message?.content || ""
      } else {
        const response = await axios.post(
          "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
          {
            inputs: `<s>[INST] You are a helpful coding assistant. ${prompt} [/INST]`,
            parameters: {
              max_new_tokens: 1000,
              temperature: 0.7,
              return_full_text: false
            }
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
            },
          }
        )
        return response.data[0]?.generated_text || ""
      }
    } catch (error: any) {
      console.error("API error:", error)
      if (error.response?.status === 503) {
        setIsModelLoading(true)
        setTimeout(() => setIsModelLoading(false), 20000)
        throw new Error("Model is loading. Please try again in 10-20 seconds.")
      }
      throw new Error("Failed to get AI response. Please try again.")
    }
  }

  const handleSendMessage = async () => {
    const now = Date.now()
    if (now - lastRequestTime < 3000) {
      setError("Please wait a moment before sending another message")
      return
    }
    
    if (!message.trim() || isLoading || isModelLoading) return

    const userMessage: Message = {
      id: now.toString(),
      sender: "You",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      avatar: "/user-avatar.png",
      isAI: false
    }

    setMessages(prev => [...prev, userMessage])
    setMessage("")
    setIsLoading(true)
    setError(null)
    setLastRequestTime(now)

    if (activeTab === "ai") {
      try {
        const aiContent = await getAIResponse(message)
        const aiMessage: Message = {
          id: Date.now().toString() + "-ai",
          sender: "AI Assistant",
          content: aiContent,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          avatar: "/ai-avatar.png",
          isAI: true
        }
        setMessages(prev => [...prev, aiMessage])
      } catch (err: any) {
        setError(err.message)
        console.error("Error getting AI response:", err)
      } finally {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const renderMessageContent = (content: string) => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({node, inline, className, children, ...props}) {
          if (inline) {
            return <code className="rounded bg-slate-700 px-1 py-0.5 text-sm">{children}</code>
          }
          return (
            <div className="my-2 overflow-hidden rounded-md bg-slate-800">
              <div className="flex items-center justify-between bg-slate-900 px-3 py-1">
                <span className="font-mono text-xs text-slate-400">Code</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-slate-400 hover:text-slate-200"
                  onClick={() => navigator.clipboard.writeText(String(children))}
                >
                  <Icons.copy className="h-3 w-3" />
                </Button>
              </div>
              <pre className="overflow-x-auto p-3 font-mono text-xs">
                <code>{children}</code>
              </pre>
            </div>
          )
        }
      }}
    >
      {content}
    </ReactMarkdown>
  )

  const quickPrompts = [
    "Explain this code:",
    "How can I optimize this?",
    "What's wrong with this implementation?",
    "Suggest improvements for:"
  ]

  return (
    <div className="flex h-full flex-col border-l border-slate-800 bg-slate-900">
      <div className="flex h-12 items-center justify-between border-b border-slate-800 px-4">
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "team" | "ai")} className="w-full">
          <TabsList className="grid h-8 w-full grid-cols-2 bg-slate-800">
            <TabsTrigger
              value="team"
              className="text-xs data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              Team Chat
            </TabsTrigger>
            <TabsTrigger
              value="ai"
              className="text-xs data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              AI Assistant
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {activeTab === "ai" && (
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-slate-700 bg-slate-800 text-xs text-slate-300">
              {apiProvider === "openai" ? "OpenAI" : "Hugging Face"}
            </Badge>
            {isModelLoading && (
              <div className="flex items-center gap-1 text-xs text-amber-400">
                <Icons.spinner className="h-3 w-3 animate-spin" />
                <span>Model Loading...</span>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs text-slate-400 hover:text-slate-200"
            onClick={() => setApiProvider(prev => prev === "openai" ? "huggingface" : "openai")}
          >
            Switch to {apiProvider === "openai" ? "Hugging Face" : "OpenAI"}
          </Button>
        </div>
      )}

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.isAI ? "" : "flex-row-reverse"}`}>
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={msg.avatar} alt={msg.sender} />
                <AvatarFallback className={`${msg.isAI ? "bg-emerald-700" : "bg-slate-700"} text-white`}>
                  {msg.sender.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className={`flex max-w-[85%] flex-col ${msg.isAI ? "items-start" : "items-end"}`}>
                <div className={`mb-1 flex items-center gap-2 ${msg.isAI ? "" : "flex-row-reverse"}`}>
                  <span className="text-sm font-medium text-slate-200">{msg.sender}</span>
                  <span className="text-xs text-slate-400">{msg.timestamp}</span>
                  {msg.isAI && (
                    <Badge variant="outline" className="border-emerald-800 bg-emerald-900/30 text-xs text-emerald-400">
                      AI
                    </Badge>
                  )}
                </div>
                <div className={`rounded-lg px-3 py-2 ${
                  msg.isAI ? "bg-slate-800 text-slate-200" : "bg-emerald-600 text-white"
                }`}>
                  {renderMessageContent(msg.content)}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src="/ai-avatar.png" alt="AI Assistant" />
                <AvatarFallback className="bg-emerald-700 text-white">AI</AvatarFallback>
              </Avatar>
              <div className="flex items-center space-x-1 rounded-lg bg-slate-800 px-3 py-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></div>
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 delay-100"></div>
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 delay-200"></div>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-amber-500/50 bg-amber-900/20 p-3 text-sm text-amber-200">
              {error}
              {isModelLoading && (
                <div className="mt-1 flex items-center gap-2 text-xs">
                  <Icons.spinner className="h-3 w-3 animate-spin" />
                  <span>Model is loading...</span>
                </div>
              )}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t border-slate-800 p-4">
        {activeTab === "ai" && (
          <div className="mb-2 flex gap-2 overflow-x-auto pb-2">
            {quickPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="whitespace-nowrap rounded-full border-slate-700 bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 hover:text-white"
                onClick={() => setMessage(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Input
            placeholder={`Message ${activeTab === "team" ? "your team" : "AI assistant"}...`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            className="flex-1 bg-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || !message.trim() || isModelLoading}
            className="bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {isLoading ? (
              <Icons.spinner className="h-4 w-4 animate-spin" />
            ) : (
              <Icons.arrowRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}