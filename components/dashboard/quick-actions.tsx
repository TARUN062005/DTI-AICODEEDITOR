"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function QuickActions() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [projectType, setProjectType] = useState("blank")
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateProject = async () => {
    if (!projectName.trim()) return

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    setIsOpen(false)

    // Navigate to the editor with a new project
    router.push(`/editor/new?name=${encodeURIComponent(projectName)}&template=${projectType}`)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <div className="flex items-center gap-2 rounded-full bg-background/80 p-1.5 shadow-lg backdrop-blur-md border border-border/50">
        <TooltipProvider>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" className="rounded-full bg-primary text-primary-foreground">
                    <Icons.add className="h-4 w-4" />
                    <span className="sr-only">New Project</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>New Project</p>
                </TooltipContent>
              </Tooltip>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>Start a new coding project from scratch or use a template.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    placeholder="My Awesome Project"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="template">Template</Label>
                  <Select value={projectType} onValueChange={setProjectType}>
                    <SelectTrigger id="template">
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blank">Blank Project</SelectItem>
                      <SelectItem value="react">React App</SelectItem>
                      <SelectItem value="next">Next.js App</SelectItem>
                      <SelectItem value="node">Node.js API</SelectItem>
                      <SelectItem value="python">Python Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProject} disabled={isLoading || !projectName.trim()}>
                  {isLoading ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Project"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <Icons.upload className="h-4 w-4" />
                <span className="sr-only">Import Project</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Import Project</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <Icons.gitBranch className="h-4 w-4" />
                <span className="sr-only">Clone Repository</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Clone Repository</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <Icons.fileText className="h-4 w-4" />
                <span className="sr-only">Templates</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Templates</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
