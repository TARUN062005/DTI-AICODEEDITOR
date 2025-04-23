"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

export default function NewProjectPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [projectLanguage, setProjectLanguage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!projectName) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real app, you would call your API to create a new project
      console.log({
        name: projectName,
        description: projectDescription,
        language: projectLanguage,
      })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: "Project created successfully",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl py-10">
      <div className="mb-8 flex items-center">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4 text-slate-400 hover:text-slate-200">
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-white">Create New Project</h1>
      </div>

      <Card className="border-slate-800 bg-slate-900">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-slate-200">Project Details</CardTitle>
            <CardDescription className="text-slate-400">
              Fill in the information below to create your new project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-200">
                Project Name
              </label>
              <Input
                id="name"
                placeholder="My Awesome Project"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="bg-slate-800 text-slate-200 placeholder:text-slate-500"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-slate-200">
                Description
              </label>
              <Textarea
                id="description"
                placeholder="A brief description of your project"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="min-h-24 bg-slate-800 text-slate-200 placeholder:text-slate-500"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="language" className="text-sm font-medium text-slate-200">
                Primary Language
              </label>
              <Select value={projectLanguage} onValueChange={setProjectLanguage}>
                <SelectTrigger className="bg-slate-800 text-slate-200">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 text-slate-200">
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="html">HTML/CSS</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="csharp">C#</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="go">Go</SelectItem>
                  <SelectItem value="rust">Rust</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-200"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-emerald-600 text-white hover:bg-emerald-700">
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Icons.add className="mr-2 h-4 w-4" />
                  Create Project
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
