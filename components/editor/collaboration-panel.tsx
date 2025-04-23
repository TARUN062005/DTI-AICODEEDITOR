"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface CollaborationPanelProps {
  onClose: () => void
}

export function CollaborationPanel({ onClose }: CollaborationPanelProps) {
  const [activeTab, setActiveTab] = useState("collaborators")
  const [inviteEmail, setInviteEmail] = useState("")
  const [isInviting, setIsInviting] = useState(false)

  // Mock collaborators data
  const collaborators = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "owner",
      status: "online",
      avatar: "/placeholder.svg?height=32&width=32",
      color: "#4CAF50",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "editor",
      status: "online",
      avatar: "/placeholder.svg?height=32&width=32",
      color: "#2196F3",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      role: "viewer",
      status: "offline",
      avatar: "/placeholder.svg?height=32&width=32",
      color: "#9C27B0",
    },
  ]

  // Mock comments data
  const comments = [
    {
      id: "1",
      author: "Jane Smith",
      avatar: "/placeholder.svg?height=32&width=32",
      content: "I think we should refactor this function to be more efficient.",
      timestamp: "10:30 AM",
      location: "script.js:24",
    },
    {
      id: "2",
      author: "Bob Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      content: "This CSS class is not being used anywhere. Can we remove it?",
      timestamp: "Yesterday",
      location: "styles.css:156",
    },
  ]

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return

    setIsInviting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setInviteEmail("")
    setIsInviting(false)
  }

  return (
    <div className="fixed bottom-0 right-0 top-12 z-40 w-80 border-l bg-background shadow-lg">
      <div className="flex h-12 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <Icons.users className="h-4 w-4" />
          <span className="font-medium">Collaboration</span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <Icons.x className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="collaborators"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Collaborators
            </TabsTrigger>
            <TabsTrigger
              value="comments"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Comments
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="collaborators" className="p-0">
          <div className="border-b p-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Invite by email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1"
              />
              <Button size="sm" onClick={handleInvite} disabled={isInviting || !inviteEmail.trim()}>
                {isInviting ? (
                  <Icons.spinner className="h-4 w-4 animate-spin" />
                ) : (
                  <Icons.userPlus className="h-4 w-4" />
                )}
                <span className="sr-only">Invite</span>
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="p-4">
              <h3 className="mb-2 text-sm font-medium">Active Now</h3>
              <div className="space-y-2">
                {collaborators.map((collaborator) => (
                  <div key={collaborator.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                          <AvatarFallback style={{ backgroundColor: collaborator.color }}>
                            {collaborator.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span
                          className={cn(
                            "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background",
                            collaborator.status === "online" ? "bg-green-500" : "bg-gray-400",
                          )}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{collaborator.name}</p>
                        <p className="text-xs text-muted-foreground">{collaborator.role}</p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        collaborator.role === "owner"
                          ? "border-purple-500 text-purple-500"
                          : collaborator.role === "editor"
                            ? "border-blue-500 text-blue-500"
                            : "border-gray-500 text-gray-500",
                      )}
                    >
                      {collaborator.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="comments" className="p-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="p-4">
              <h3 className="mb-2 text-sm font-medium">Thread Comments</h3>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="rounded-lg border p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={comment.avatar} alt={comment.author} />
                          <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{comment.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {comment.location}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        <Icons.messageSquare className="mr-1 h-3 w-3" />
                        Reply
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        <Icons.check className="mr-1 h-3 w-3" />
                        Resolve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <div className="flex items-center gap-2">
              <Input placeholder="Add a comment..." className="flex-1" />
              <Button size="sm">
                <Icons.send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
