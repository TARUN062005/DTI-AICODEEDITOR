"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { useRouter } from "next/navigation"

interface ActiveShare {
  id: string
  content: string
}

export default function LiveSharePage() {
  const [shareId, setShareId] = useState("")
  const [content, setContent] = useState("")
  const [joinId, setJoinId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeShare, setActiveShare] = useState<ActiveShare | null>(null)
  const router = useRouter()

  // Generate a random ID for sharing
  useEffect(() => {
    const generateId = () => {
      return Math.random().toString(36).substring(2, 10)
    }
    setShareId(generateId())
  }, [])

  // Mock function to create a new share
  const createShare = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call to create a share
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Store in localStorage for demo purposes
      localStorage.setItem(`share_${shareId}`, content)

      setActiveShare({ id: shareId, content })
      toast({
        title: "Share created!",
        description: `Your share ID is: ${shareId}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create share",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Mock function to join an existing share
  const joinShare = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call to join a share
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Retrieve from localStorage for demo purposes
      const sharedContent = localStorage.getItem(`share_${joinId}`)

      if (sharedContent) {
        setActiveShare({ id: joinId, content: sharedContent })
        setContent(sharedContent)
        toast({
          title: "Joined share!",
          description: `You've joined share: ${joinId}`,
        })
      } else {
        toast({
          title: "Error",
          description: "Share not found",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join share",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Mock function to update shared content
  const updateSharedContent = (newContent: string) => {
    setContent(newContent)
    if (activeShare) {
      // In a real app, this would be an API call to update the share
      localStorage.setItem(`share_${activeShare.id}`, newContent)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Live Share</h1>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white"
          >
            <Icons.chevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {activeShare ? (
          <Card className="border-slate-700 bg-slate-800">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Active Share: {activeShare.id}</CardTitle>
              <CardDescription className="text-slate-300">
                Share this ID with others to collaborate in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={content}
                onChange={(e) => updateSharedContent(e.target.value)}
                className="min-h-[400px] w-full bg-slate-700 text-white placeholder:text-slate-400 text-lg"
                placeholder="Type your content here..."
              />
            </CardContent>
            <CardFooter className="flex justify-between gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(activeShare.id)
                  toast({
                    title: "Copied!",
                    description: "Share ID copied to clipboard",
                  })
                }}
                className="flex-1 border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white"
              >
                <Icons.copy className="mr-2 h-5 w-5" />
                Copy Share ID
              </Button>
              <Button 
                onClick={() => setActiveShare(null)} 
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                End Session
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800">
              <TabsTrigger 
                value="create" 
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-white py-3"
              >
                Create Share
              </TabsTrigger>
              <TabsTrigger 
                value="join" 
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-white py-3"
              >
                Join Share
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="mt-4">
              <Card className="border-slate-700 bg-slate-800">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Create a New Share</CardTitle>
                  <CardDescription className="text-slate-300">
                    Share your code or text with others in real-time
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <label className="block text-lg font-medium text-white">Share ID</label>
                    <div className="flex gap-2">
                      <Input 
                        value={shareId} 
                        readOnly 
                        className="flex-1 bg-slate-700 text-white text-lg h-12" 
                      />
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => {
                          navigator.clipboard.writeText(shareId)
                          toast({
                            title: "Copied!",
                            description: "Share ID copied to clipboard",
                          })
                        }}
                        className="border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white h-12 px-4"
                      >
                        <Icons.copy className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-lg font-medium text-white">Content</label>
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[300px] w-full bg-slate-700 text-white placeholder:text-slate-400 text-lg"
                      placeholder="Type your content here..."
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={createShare}
                    disabled={isLoading || !content.trim()}
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white text-lg"
                  >
                    {isLoading ? (
                      <>
                        <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Share"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="join" className="mt-4">
              <Card className="border-slate-700 bg-slate-800">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Join an Existing Share</CardTitle>
                  <CardDescription className="text-slate-300">
                    Enter a share ID to join an existing session
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <label className="block text-lg font-medium text-white">Share ID</label>
                    <Input
                      value={joinId}
                      onChange={(e) => setJoinId(e.target.value)}
                      className="bg-slate-700 text-white text-lg h-12"
                      placeholder="Enter share ID..."
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={joinShare}
                    disabled={isLoading || !joinId.trim()}
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white text-lg"
                  >
                    {isLoading ? (
                      <>
                        <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      "Join Share"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}