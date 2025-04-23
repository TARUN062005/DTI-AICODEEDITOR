"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

export function AISpotlight() {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      title: "AI Code Generation",
      description: "Generate code snippets, functions, and even entire components with natural language prompts.",
      icon: <Icons.cpu className="h-10 w-10" />,
      cta: "Try Code Generation",
      gradient: "from-blue-500/20 to-indigo-500/20",
      textGradient: "from-blue-500 to-indigo-500",
    },
    {
      title: "Real-time Code Suggestions",
      description: "Get intelligent code suggestions as you type, helping you code faster and with fewer errors.",
      icon: <Icons.lightbulb className="h-10 w-10" />,
      cta: "Enable Suggestions",
      gradient: "from-amber-500/20 to-orange-500/20",
      textGradient: "from-amber-500 to-orange-500",
    },
    {
      title: "AI-Powered Debugging",
      description: "Identify and fix bugs quickly with AI that understands your code and suggests solutions.",
      icon: <Icons.bug className="h-10 w-10" />,
      cta: "Debug with AI",
      gradient: "from-green-500/20 to-emerald-500/20",
      textGradient: "from-green-500 to-emerald-500",
    },
  ]

  return (
    <Card className="overflow-hidden border-none bg-transparent shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            AI-Powered Development
          </span>
          <Icons.sparkles className="h-5 w-5 text-primary" />
        </CardTitle>
        <CardDescription>Supercharge your coding workflow with our AI assistant</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={cn(
                "overflow-hidden transition-all duration-300 hover:shadow-md",
                index === activeFeature ? "ring-1 ring-primary/20" : "",
                "bg-gradient-to-br",
                feature.gradient,
              )}
              onMouseEnter={() => setActiveFeature(index)}
            >
              <CardHeader>
                <div className="mb-2 rounded-full bg-background/80 p-2 w-fit backdrop-blur-sm">{feature.icon}</div>
                <CardTitle className={cn("bg-gradient-to-r bg-clip-text text-transparent", feature.textGradient)}>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{feature.description}</p>
                <Button variant="outline" className="bg-background/80 backdrop-blur-sm">
                  {feature.cta}
                  <Icons.arrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
