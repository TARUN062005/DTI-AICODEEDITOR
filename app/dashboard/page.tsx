"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectCard } from "@/components/dashboard/project-card"
import { AISpotlight } from "@/components/dashboard/ai-spotlight"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { useUser } from "@clerk/nextjs"

export default function DashboardPage() {
  const router = useRouter()
  const { isLoaded, isSignedIn } = useUser()
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/auth/login")
    }
  }, [isLoaded, isSignedIn, router])

  // Mock projects data remains exactly the same
  const projects = [
    {
      id: "1",
      name: "React Todo App",
      description: "A simple todo application built with React",
      language: "TypeScript",
      lastUpdated: "2023-04-05T14:48:00.000Z",
      starred: true,
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    // ... rest of the projects array remains unchanged
  ]

  // Loading state simulation remains the same
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.language.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleProjectClick = (projectId: string) => {
    router.push(`/editor/${projectId}`)
  }

  if (!isLoaded || !isSignedIn) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background to-background/80">
      {/* Main Content */}
      <div className="flex-1 container py-8 space-y-8">
        {/* Header with search and actions */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-72">
              <Icons.search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search projects..."
                className="w-full pl-10 h-12 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Quick Actions Floating Toolbar */}
        <QuickActions />

        {/* AI Spotlight Section */}
        <AISpotlight />

        {/* Projects Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-lg gap-2 p-2 bg-muted/50">
            <TabsTrigger value="all" className="h-12 text-base">All</TabsTrigger>
            <TabsTrigger value="recent" className="h-12 text-base">Recent</TabsTrigger>
            <TabsTrigger value="starred" className="h-12 text-base">Starred</TabsTrigger>
            <TabsTrigger value="archived" className="h-12 text-base">Archived</TabsTrigger>
          </TabsList>

          {/* All Projects Tab */}
          <TabsContent value="all" className="mt-8">
            {isLoading ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="h-[300px] animate-pulse bg-muted/40 rounded-xl" />
                ))}
              </div>
            ) : filteredProjects.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    onClick={() => handleProjectClick(project.id)}
                    className="hover:scale-[1.02] transition-transform duration-200"
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center space-y-4">
                <Icons.folder className="h-16 w-16 text-muted-foreground" />
                <h3 className="text-2xl font-medium">No projects found</h3>
                <p className="text-lg text-muted-foreground">
                  {searchQuery ? `No projects matching "${searchQuery}"` : "Get started by creating a new project"}
                </p>
                <Button 
                  className="h-12 px-8 text-lg mt-6" 
                  onClick={() => router.push("/editor/new")}
                >
                  <Icons.add className="mr-3 h-5 w-5" />
                  Create New Project
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Other tabs remain the same but with improved spacing */}
          <TabsContent value="recent" className="mt-8">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.slice(0, 3).map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onClick={() => handleProjectClick(project.id)}
                  className="hover:scale-[1.02] transition-transform duration-200"
                />
              ))}
            </div>
          </TabsContent>

          {/* Starred and Archived tabs follow same pattern */}
          {/* ... */}
        </Tabs>
      </div>
    </div>
  )
}