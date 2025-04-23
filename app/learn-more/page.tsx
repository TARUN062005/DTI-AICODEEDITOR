import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code, Users, MessageSquare, Terminal, Cpu } from "lucide-react"

export default function LearnMorePage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-4">About CodeCollab</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          This is an AI-powered code editor with real-time collaboration features, helping users write, test, and share
          code easily.
        </p>
      </div>

      <Separator className="my-8" />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <Code className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Intelligent Code Editor</CardTitle>
            <CardDescription>Write code with syntax highlighting and AI-powered suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Our editor supports multiple programming languages with real-time syntax highlighting and intelligent code
              completion.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <Users className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Real-time Collaboration</CardTitle>
            <CardDescription>Work together with your team in real-time</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Multiple users can edit the same codebase simultaneously, making pair programming and code reviews
              seamless.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <MessageSquare className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Integrated Chat</CardTitle>
            <CardDescription>Communicate without leaving the editor</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Discuss code changes and ideas with your team using our built-in chat functionality.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <Terminal className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Integrated Terminal</CardTitle>
            <CardDescription>Run commands directly in the editor</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Execute commands and see output without switching between applications.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <Cpu className="h-10 w-10 text-primary mb-2" />
            <CardTitle>AI Assistance</CardTitle>
            <CardDescription>Get intelligent code suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Our AI assistant helps you write better code with suggestions, explanations, and automatic error
              detection.
            </p>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle>Ready to start coding?</CardTitle>
            <CardDescription>Try our code editor now</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Link href="/code-editor">
              <Button className="w-full">
                Open Code Editor
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-12" />

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Start Coding Today</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Join thousands of developers who are already using CodeCollab to build amazing projects.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/code-editor">
            <Button size="lg">
              Try the Editor
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
