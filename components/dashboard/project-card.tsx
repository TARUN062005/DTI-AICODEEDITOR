"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface ProjectCardProps {
  project: {
    id: string
    name: string
    description: string
    language: string
    lastUpdated: string
    starred?: boolean
    thumbnail?: string
  }
  onClick: () => void
  className?: string
}

export function ProjectCard({ project, onClick, className }: ProjectCardProps) {
  const [isStarred, setIsStarred] = useState(project.starred || false)
  const [isHovered, setIsHovered] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return "Today"
    } else if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date)
    }
  }

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      JavaScript: "bg-yellow-500 hover:bg-yellow-600",
      TypeScript: "bg-blue-500 hover:bg-blue-600",
      Python: "bg-green-500 hover:bg-green-600",
      "HTML/CSS": "bg-orange-500 hover:bg-orange-600",
    }
    return colors[language] || "bg-slate-500 hover:bg-slate-600"
  }

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all duration-300 hover:shadow-lg border border-border/50 hover:border-primary/30",
        isHovered ? "ring-2 ring-primary/20" : "",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative h-40 w-full overflow-hidden bg-muted/30">
        {project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={project.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <Icons.fileCode className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />

        <div className="absolute right-3 top-3 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
            onClick={(e) => {
              e.stopPropagation()
              setIsStarred(!isStarred)
            }}
          >
            <Icons.star
              className={cn(
                "h-5 w-5 transition-all",
                isStarred ? "fill-yellow-400 text-yellow-400 scale-110" : "text-muted-foreground"
              )}
            />
            <span className="sr-only">Star project</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
                onClick={(e) => e.stopPropagation()}
              >
                <Icons.ellipsis className="h-5 w-5 text-muted-foreground" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="text-base">
                <Icons.edit className="mr-3 h-5 w-5" />
                <span>Rename</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-base">
                <Icons.copy className="mr-3 h-5 w-5" />
                <span>Duplicate</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-base">
                <Icons.share className="mr-3 h-5 w-5" />
                <span>Share</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-base">
                <Icons.archive className="mr-3 h-5 w-5" />
                <span>Archive</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-base text-destructive focus:text-destructive">
                <Icons.trash className="mr-3 h-5 w-5" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardContent className="p-5">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold leading-tight tracking-tight">{project.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge className={cn("text-white px-3 py-1.5 text-sm", getLanguageColor(project.language))}>
            {project.language}
          </Badge>
          <span className="text-sm text-muted-foreground">Updated {formatDate(project.lastUpdated)}</span>
        </div>

        <Button 
          variant="ghost" 
          size="sm" 
          className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary"
          onClick={(e) => {
            e.stopPropagation()
            onClick()
          }}
        >
          <Icons.arrowRight className="h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  )
}