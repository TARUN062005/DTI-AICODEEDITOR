"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

interface CollaboratorsPanelProps {
  projectId: string
}

export function CollaboratorsPanel({ projectId }: CollaboratorsPanelProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("collaborators")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<any[]>([
    {
      id: "welcome",
      sender: "System",
      content: "Welcome to the team chat! You can collaborate with your team members here.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      avatar: "/placeholder.svg?height=32&width=32",
      isSystem: true,
    },
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock collaborators data
  const collaborators = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "owner",
      status: "online",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "editor",
      status: "online",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      role: "viewer",
      status: "offline",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real app, you would call your API to invite a collaborator
      console.log({
        projectId,
        email,
      })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: `Invitation sent to ${email}`,
      })

      setEmail("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = () => {
    if (!message.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      sender: "You",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      avatar: "/placeholder.svg?height=32&width=32",
    }

    setMessages((prev) => [...prev, userMessage])
    setMessage("")

    // Simulate team member response
    setTimeout(() => {
      const randomCollaborator = collaborators[Math.floor(Math.random() * collaborators.length)]
      const teamMessage = {
        id: Date.now().toString() + "-team",
        sender: randomCollaborator.name,
        content: "Thanks for your message! I'll take a look at that.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        avatar: randomCollaborator.avatar,
      }
      setMessages((prev) => [...prev, teamMessage])
    }, 2000)
  }

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      owner: "bg-purple-600 text-white",
      editor: "bg-blue-600 text-white",
      viewer: "bg-slate-600 text-white",
    }
    return colors[role] || "bg-slate-600 text-white"
  }

  return (
    <div className="flex h-full flex-col bg-slate-900">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid h-10 w-full grid-cols-2 bg-slate-900">
          <TabsTrigger
            value="collaborators"
            className="data-[state=active]:bg-slate-800 data-[state=active]:text-white"
          >
            Collaborators
          </TabsTrigger>
          <TabsTrigger value="chat" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">
            Team Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="collaborators" className="flex-1 p-0">
          <div className="border-b border-slate-800 p-4">
            <form onSubmit={handleInvite} className="flex gap-2">
              <Input
                placeholder="Invite by email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-slate-800 text-slate-200 placeholder:text-slate-500"
              />
              <Button
                type="submit"
                size="sm"
                disabled={isLoading}
                className="bg-emerald-600 text-white hover:bg-emerald-700"
              >
                {isLoading ? (
                  <Icons.spinner className="h-4 w-4 animate-spin" />
                ) : (
                  <Icons.userPlus className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {collaborators.map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                        <AvatarFallback className="bg-slate-700 text-slate-200">
                          {collaborator.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-slate-950 ${
                          collaborator.status === "online" ? "bg-green-500" : "bg-slate-500"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{collaborator.name}</p>
                      <p className="text-xs text-slate-400">{collaborator.role}</p>
                    </div>
                  </div>
                  <div className={`rounded-full px-2 py-1 text-xs font-medium ${getRoleBadgeColor(collaborator.role)}`}>
                    {collaborator.role.charAt(0).toUpperCase() + collaborator.role.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="chat" className="flex-1 p-0 flex flex-col">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="flex gap-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={msg.avatar} alt={msg.sender} />
                    <AvatarFallback className={`${msg.isSystem ? "bg-blue-700" : "bg-slate-700"} text-white`}>
                      {msg.sender.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-200">{msg.sender}</span>
                      <span className="text-xs text-slate-400">{msg.timestamp}</span>
                      {msg.isSystem && (
                        <Badge variant="outline" className="border-blue-800 bg-blue-900/30 text-xs text-blue-400">
                          System
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-slate-300">{msg.content}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="border-t border-slate-800 p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Message team..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                className="flex-1 bg-slate-800 text-slate-200 placeholder:text-slate-500"
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                className="bg-emerald-600 text-white hover:bg-emerald-700"
              >
                <Icons.arrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
