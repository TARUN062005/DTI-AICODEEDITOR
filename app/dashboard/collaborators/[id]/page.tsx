"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"

interface CollaboratorsPageProps {
  params: {
    id: string
  }
}

export default function CollaboratorsPage({ params }: CollaboratorsPageProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("viewer")
  const [isLoading, setIsLoading] = useState(false)

  const project = {
    id: params.id,
    name: "React Todo App",
    description: "A simple todo application built with React",
  }

  const collaborators = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "owner",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "editor",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      role: "viewer",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

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
      console.log({
        projectId: params.id,
        email,
        role,
      })

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

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      owner: "bg-gradient-to-r from-gray-700 to-gray-600 text-white",
      editor: "bg-gradient-to-r from-gray-600 to-gray-500 text-white",
      viewer: "bg-gradient-to-r from-gray-500 to-gray-400 text-white",
    }
    return colors[role] || "bg-gradient-to-r from-gray-500 to-gray-400 text-white"
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-auto">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-700 bg-gradient-to-r from-gray-800/90 to-gray-900/90 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="group h-10 w-10 rounded-full border border-gray-700 bg-gray-800/50 p-0 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <Icons.chevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
            <span className="sr-only">Back</span>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-white md:text-2xl">{project.name}</h1>
            <p className="text-sm text-gray-400/80">{project.description}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Invite Card */}
          <Card className="border-gray-700 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white">Invite Collaborators</CardTitle>
              <CardDescription className="text-gray-400/70">
                Invite team members to collaborate on this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInvite} className="flex flex-col gap-3 sm:flex-row">
                <Input
                  placeholder="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 border-gray-700 bg-gray-800/50 text-white placeholder:text-gray-400/50 focus:border-gray-500 focus:ring-gray-500"
                />
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="min-w-[120px] border-gray-700 bg-gray-800/50 text-white">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gradient-to-b from-gray-800 to-gray-900 text-white">
                    <SelectItem value="viewer" className="hover:bg-gray-700/50 focus:bg-gray-700/50">Viewer</SelectItem>
                    <SelectItem value="editor" className="hover:bg-gray-700/50 focus:bg-gray-700/50">Editor</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-lg shadow-gray-500/10 hover:from-gray-700/90 hover:to-gray-600/90"
                >
                  {isLoading ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Icons.userPlus className="mr-2 h-4 w-4" />
                      Invite
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Collaborators List */}
          <Card className="border-gray-700 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white">Collaborators</CardTitle>
              <CardDescription className="text-gray-400/70">
                Manage who has access to this project
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-700/30">
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex items-center justify-between p-4 transition-colors hover:bg-gray-800/30"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                        <AvatarFallback className="bg-gradient-to-r from-gray-600 to-gray-500 text-white">
                          {collaborator.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-white">{collaborator.name}</p>
                        <p className="text-sm text-gray-400/70">{collaborator.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getRoleBadgeColor(collaborator.role)}`}
                      >
                        {collaborator.role.charAt(0).toUpperCase() + collaborator.role.slice(1)}
                      </span>
                      {collaborator.role !== "owner" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400/70 hover:bg-gray-700/50 hover:text-white"
                            >
                              <Icons.ellipsis className="h-4 w-4" />
                              <span className="sr-only">More options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="border-gray-700 bg-gradient-to-b from-gray-800 to-gray-900 text-white"
                          >
                            <DropdownMenuItem className="hover:bg-gray-700/50 focus:bg-gray-700/50">
                              <Icons.settings className="mr-2 h-4 w-4" />
                              <span>Change Role</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-400 hover:bg-gray-700/50 hover:text-red-400 focus:bg-gray-700/50">
                              <Icons.trash className="mr-2 h-4 w-4" />
                              <span>Remove</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}